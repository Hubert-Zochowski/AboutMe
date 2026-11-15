import assert from 'node:assert/strict';

const origin = process.env.ABOUTME_LOCAL_ORIGIN || 'http://127.0.0.1:8787';
const url = new URL(origin);
if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error('This check is for local servers only.');
const get = path => fetch(new URL(path, origin), { signal: AbortSignal.timeout(10000), redirect: 'manual' });

const page = await get('/');
assert.equal(page.status, 200);
assert.match(await page.text(), /Panel treści/);
assert.equal(page.headers.get('X-Content-Type-Options'), 'nosniff');
assert.equal(page.headers.get('X-Frame-Options'), 'DENY');
for (const path of ['/styles.css', '/app.js']) assert.equal((await get(path)).status, 200);
const healthResponse = await get('/api/health');
assert.equal(healthResponse.status, 200);
const health = await healthResponse.json();
assert.equal(health.database, 'ready');
assert.equal(healthResponse.headers.get('Cache-Control'), 'no-store');
for (const path of ['/api/session', '/api/drafts', '/api/assets/test']) {
    const response = await get(path);
    assert.equal(response.status, health.authentication === 'configured' ? 401 : 503);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
}
console.log('PASS: local panel and static assets, live D1 health, security headers, private API denied.');
