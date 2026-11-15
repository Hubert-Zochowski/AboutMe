import type { Env } from './types.ts';
import { HttpError, cookie, cookieHeader, cookieName, json, now, randomToken, requireConfiguration, requireSameOrigin, requireSession, sha256 } from './security.ts';

const STATE_TTL = 600;
const SESSION_TTL = 8 * 60 * 60;

export async function startLogin(env: Env): Promise<Response> {
    const origin = requireConfiguration(env);
    const state = randomToken();
    // Expired entries are pruned and pending attempts capped to bound anonymous writes.
    await env.DB.prepare('DELETE FROM oauth_states WHERE expires_at <= ?').bind(now()).run();
    const inserted = await env.DB.prepare('INSERT INTO oauth_states (state_hash, expires_at) SELECT ?, ? WHERE (SELECT COUNT(*) FROM oauth_states) < 20')
        .bind(await sha256(state), now() + STATE_TTL).run();
    if (inserted.meta.changes !== 1) throw new HttpError(429, 'too_many_login_attempts');
    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID!);
    authorize.searchParams.set('redirect_uri', origin + '/auth/callback');
    authorize.searchParams.set('state', state);
    return new Response(null, { status: 302, headers: {
        Location: authorize.href, 'Cache-Control': 'no-store', 'Set-Cookie': cookieHeader(env, 'oauth', state, STATE_TTL)
    } });
}

export async function callback(request: Request, env: Env): Promise<Response> {
    const origin = requireConfiguration(env);
    const url = new URL(request.url);
    const state = url.searchParams.get('state');
    if (!state || !/^[a-f0-9]{64}$/.test(state) || state !== cookie(request, cookieName(env, 'oauth'))) {
        throw new HttpError(400, 'invalid_oauth_state');
    }
    // DELETE RETURNING makes state consumption single-use even for concurrent requests.
    const consumed = await env.DB.prepare('DELETE FROM oauth_states WHERE state_hash = ? AND expires_at > ? RETURNING state_hash')
        .bind(await sha256(state), now()).first();
    if (!consumed) throw new HttpError(400, 'invalid_oauth_state');
    const code = url.searchParams.get('code');
    if (!code || code.length > 1024) throw new HttpError(400, 'oauth_cancelled');
    const exchanged = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: origin + '/auth/callback' }),
        signal: AbortSignal.timeout(10000)
    });
    if (!exchanged.ok) throw new HttpError(502, 'github_unavailable');
    const token = await exchanged.json<{ access_token?: string }>();
    if (!token.access_token) throw new HttpError(401, 'github_login_failed');
    const identity = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token.access_token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'AboutMe-Admin' },
        signal: AbortSignal.timeout(10000)
    });
    if (!identity.ok) throw new HttpError(502, 'github_unavailable');
    const user = await identity.json<{ id: number; login: string }>();
    if (String(user.id) !== env.ADMIN_GITHUB_USER_ID) throw new HttpError(403, 'account_not_allowed');
    const session = randomToken();
    await env.DB.batch([
        env.DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(now()),
        env.DB.prepare('INSERT INTO sessions (token_hash, github_user_id, github_login, expires_at) VALUES (?, ?, ?, ?)')
            .bind(await sha256(session), String(user.id), user.login, now() + SESSION_TTL)
    ]);
    const headers = new Headers({ Location: '/', 'Cache-Control': 'no-store' });
    headers.append('Set-Cookie', cookieHeader(env, 'session', session, SESSION_TTL));
    headers.append('Set-Cookie', cookieHeader(env, 'oauth', '', 0));
    return new Response(null, { status: 302, headers });
}

export async function logout(request: Request, env: Env): Promise<Response> {
    requireSameOrigin(request, env);
    await requireSession(request, env);
    const token = cookie(request, cookieName(env, 'session'))!;
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
    const response = json({ ok: true });
    response.headers.set('Set-Cookie', cookieHeader(env, 'session', '', 0));
    return response;
}
