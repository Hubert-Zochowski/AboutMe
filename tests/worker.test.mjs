import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/src/index.ts';
import { cookieHeader, now, sha256 } from '../worker/src/security.ts';
import { createDatabase } from './helpers/d1.mjs';

function environment(t, overrides = {}) {
    const DB = createDatabase();
    t.after(() => DB.sqlite.close());
    return {
        DB, APP_ORIGIN: 'http://localhost:8787', ADMIN_GITHUB_USER_ID: '12345',
        GITHUB_CLIENT_ID: 'test-client', GITHUB_CLIENT_SECRET: 'test-secret',
        ASSETS: { fetch: async () => new Response('panel') }, ...overrides
    };
}
const request = (path, options) => new Request('http://localhost:8787' + path, options);
const call = (env, path, options) => worker.fetch(request(path, options), env);
async function session(env, { user = '12345', expires = now() + 1000, token = 'a'.repeat(64) } = {}) {
    await env.DB.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?)').bind(await sha256(token), user, 'owner', expires).run();
    return `aboutme_session=${token}`;
}

test('health checks database but exposes no secrets', async t => {
    const response = await call(environment(t), '/api/health');
    assert.equal(response.status, 200);
    const text = await response.text();
    assert.equal(JSON.parse(text).database, 'ready');
    assert.ok(!text.includes('test-secret'));
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('missing configuration fails closed for all private paths and login', async t => {
    const env = environment(t, { GITHUB_CLIENT_SECRET: '' });
    for (const path of ['/api/session', '/api/drafts', '/auth/login']) {
        const response = await call(env, path);
        assert.equal(response.status, 503);
        assert.deepEqual(await response.json(), { error: 'not_configured' });
    }
});

test('anonymous requests cannot read sessions, drafts or assets', async t => {
    const env = environment(t);
    for (const path of ['/api/session', '/api/drafts', '/api/assets/private']) {
        assert.equal((await call(env, path)).status, 401);
    }
});

test('expired session and different account are denied', async t => {
    for (const values of [{ expires: now() - 1 }, { user: '99999' }]) {
        const env = environment(t);
        const Cookie = await session(env, values);
        assert.equal((await call(env, '/api/session', { headers: { Cookie } })).status, 401);
    }
});

test('session accepts only allowed account and storage contains hash, not token', async t => {
    const env = environment(t);
    const Cookie = await session(env);
    const response = await call(env, '/api/session', { headers: { Cookie } });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).login, 'owner');
    const stored = env.DB.sqlite.prepare('SELECT token_hash FROM sessions').get();
    assert.notEqual(stored.token_hash, 'a'.repeat(64));
    assert.equal(stored.token_hash, await sha256('a'.repeat(64)));
});

test('cross-origin logout is denied; same-origin logout revokes session', async t => {
    const env = environment(t);
    const Cookie = await session(env);
    assert.equal((await call(env, '/auth/logout', { method: 'POST', headers: { Cookie, Origin: 'https://other.example' } })).status, 403);
    const response = await call(env, '/auth/logout', { method: 'POST', headers: { Cookie, Origin: env.APP_ORIGIN } });
    assert.equal(response.status, 200);
    assert.match(response.headers.get('Set-Cookie'), /Max-Age=0/);
    assert.equal((await call(env, '/api/session', { headers: { Cookie } })).status, 401);
});

test('HTTPS cookies use host prefix, secure, HttpOnly and SameSite', () => {
    const value = cookieHeader({ APP_ORIGIN: 'https://admin.example' }, 'session', 'abc', 100);
    assert.match(value, /^__Host-aboutme_session=/);
    for (const attribute of ['Path=/', 'HttpOnly', 'SameSite=Lax', 'Secure']) assert.ok(value.includes(attribute));
});

test('OAuth start stores hashed, expiring state and binds it to browser', async t => {
    const env = environment(t);
    const response = await call(env, '/auth/login');
    assert.equal(response.status, 302);
    const authorize = new URL(response.headers.get('Location'));
    const state = authorize.searchParams.get('state');
    assert.equal(authorize.origin, 'https://github.com');
    assert.equal(authorize.searchParams.get('redirect_uri'), env.APP_ORIGIN + '/auth/callback');
    assert.match(response.headers.get('Set-Cookie'), new RegExp(state));
    const stored = env.DB.sqlite.prepare('SELECT * FROM oauth_states').get();
    assert.equal(stored.state_hash, await sha256(state));
    assert.ok(stored.expires_at > now());
});

test('OAuth callback rejects mismatched browser cookie without network', async t => {
    const env = environment(t);
    const response = await call(env, '/auth/callback?state=' + 'a'.repeat(64) + '&code=test');
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, 'invalid_oauth_state');
});

test('OAuth state is single-use and other GitHub user cannot create a session', async t => {
    const env = environment(t);
    const originalFetch = globalThis.fetch;
    t.after(() => { globalThis.fetch = originalFetch; });
    globalThis.fetch = async url => String(url).includes('access_token')
        ? Response.json({ access_token: 'never-exposed' })
        : Response.json({ id: 99999, login: 'intruder' });
    const start = await call(env, '/auth/login');
    const state = new URL(start.headers.get('Location')).searchParams.get('state');
    const options = { headers: { Cookie: `aboutme_oauth=${state}` } };
    const url = `/auth/callback?state=${state}&code=test`;
    assert.equal((await call(env, url, options)).status, 403);
    assert.equal((await call(env, url, options)).status, 400);
    assert.equal(env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM sessions').get().n, 0);
});

test('OAuth allowed user receives a session without leaking GitHub access token', async t => {
    const env = environment(t);
    const originalFetch = globalThis.fetch;
    t.after(() => { globalThis.fetch = originalFetch; });
    globalThis.fetch = async url => String(url).includes('access_token')
        ? Response.json({ access_token: 'github-sensitive-token' })
        : Response.json({ id: 12345, login: 'owner' });
    const start = await call(env, '/auth/login');
    const state = new URL(start.headers.get('Location')).searchParams.get('state');
    const response = await call(env, `/auth/callback?state=${state}&code=test`, { headers: { Cookie: `aboutme_oauth=${state}` } });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('Location'), '/');
    const cookies = response.headers.get('Set-Cookie');
    assert.ok(!cookies.includes('github-sensitive-token'));
    const match = cookies.match(/aboutme_session=([a-f0-9]{64})/);
    assert.ok(match);
    assert.equal((await call(env, '/api/session', { headers: { Cookie: `aboutme_session=${match[1]}` } })).status, 200);
});

test('anonymous OAuth attempts are bounded and database errors do not leak', async t => {
    const env = environment(t);
    for (let i = 0; i < 20; i++) assert.equal((await call(env, '/auth/login')).status, 302);
    assert.equal((await call(env, '/auth/login')).status, 429);
    const failing = { ...env, DB: { prepare() { throw new Error('private SQL and content'); } } };
    const response = await call(failing, '/api/health');
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: 'internal_error' });
});

test('SQLite stores 512 KiB byte-for-byte and rejects oversized private assets', async t => {
    const env = environment(t);
    const image = new Uint8Array(512 * 1024).fill(173);
    const insert = env.DB.sqlite.prepare('INSERT INTO assets VALUES (?, ?, ?, ?, ?)');
    insert.run('image-1', 'image/png', image, 'hash', now());
    const stored = env.DB.sqlite.prepare('SELECT content FROM assets WHERE id = ?').get('image-1');
    assert.deepEqual(stored.content, image);
    assert.throws(() => insert.run('too-large', 'image/png', new Uint8Array(512 * 1024 + 1), 'hash', now()));
});

test('assets referenced by an in-flight publication cannot be deleted', async t => {
    const env = environment(t);
    env.DB.sqlite.exec("INSERT INTO assets VALUES ('image', 'image/png', X'00', 'hash', 1)");
    env.DB.sqlite.exec("INSERT INTO publications VALUES ('op', 'item', '1', 1, '{}', 'upsert', 'pending', NULL, NULL, 1, 1)");
    env.DB.sqlite.exec("INSERT INTO publication_assets VALUES ('op', 'image')");
    assert.throws(() => env.DB.sqlite.exec("DELETE FROM assets WHERE id = 'image'"));
});
