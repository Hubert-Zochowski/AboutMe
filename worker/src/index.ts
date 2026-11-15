import type { Env } from './types.ts';
import { callback, logout, startLogin } from './auth.ts';
import { HttpError, json, protect, requireConfiguration, requireSession } from './security.ts';

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        try {
            const url = new URL(request.url);
            let response: Response;
            if (url.pathname === '/api/health' && request.method === 'GET') {
                await env.DB.prepare('SELECT 1 AS ok').first();
                let configured = false;
                try { requireConfiguration(env); configured = true; } catch { /* Fail closed until configured. */ }
                response = json({ ok: true, database: 'ready', authentication: configured ? 'configured' : 'not_configured', stage: 'local-foundation' });
            } else if (url.pathname === '/auth/login' && request.method === 'GET') {
                response = await startLogin(env);
            } else if (url.pathname === '/auth/callback' && request.method === 'GET') {
                response = await callback(request, env);
            } else if (url.pathname === '/auth/logout' && request.method === 'POST') {
                response = await logout(request, env);
            } else if (url.pathname.startsWith('/api/')) {
                const session = await requireSession(request, env);
                if (url.pathname === '/api/session' && request.method === 'GET') {
                    response = json({ login: session.github_login, expiresAt: session.expires_at });
                } else {
                    response = json({ error: 'not_found' }, 404);
                }
            } else if (url.pathname.startsWith('/auth/')) {
                response = json({ error: 'not_found' }, 404);
            } else if (request.method === 'GET' || request.method === 'HEAD') {
                response = await env.ASSETS.fetch(request);
            } else {
                response = json({ error: 'method_not_allowed' }, 405);
            }
            return protect(response);
        } catch (error) {
            // Do not expose provider responses, SQL messages, tokens or private content.
            return protect(json({ error: error instanceof HttpError ? error.code : 'internal_error' }, error instanceof HttpError ? error.status : 500));
        }
    }
};
