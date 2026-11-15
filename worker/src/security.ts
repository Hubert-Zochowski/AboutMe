import type { Env, Session } from './types.ts';

export class HttpError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string) {
        super(code);
        this.status = status;
        this.code = code;
    }
}

export const now = () => Math.floor(Date.now() / 1000);

export function configuredOrigin(env: Env): string {
    try {
        const url = new URL(env.APP_ORIGIN || '');
        if (url.href !== url.origin + '/') throw new Error();
        if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) throw new Error();
        return url.origin;
    } catch { throw new HttpError(503, 'not_configured'); }
}

export function requireConfiguration(env: Env): string {
    const origin = configuredOrigin(env);
    if (!/^\d+$/.test(env.ADMIN_GITHUB_USER_ID || '') || !env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
        throw new HttpError(503, 'not_configured');
    }
    return origin;
}

export function cookieName(env: Env, purpose: 'session' | 'oauth'): string {
    return (configuredOrigin(env).startsWith('https:') ? '__Host-' : '') + 'aboutme_' + purpose;
}

export function cookie(request: Request, name: string): string | undefined {
    return request.headers.get('Cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith(name + '='))?.slice(name.length + 1);
}

export function cookieHeader(env: Env, purpose: 'session' | 'oauth', token: string, maxAge: number): string {
    const secure = configuredOrigin(env).startsWith('https:') ? '; Secure' : '';
    return `${cookieName(env, purpose)}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function randomToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function sha256(value: string | ArrayBuffer): Promise<string> {
    const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value;
    return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function requireSession(request: Request, env: Env): Promise<Session> {
    requireConfiguration(env);
    const token = cookie(request, cookieName(env, 'session'));
    if (!token || !/^[a-f0-9]{64}$/.test(token)) throw new HttpError(401, 'unauthorized');
    const row = await env.DB.prepare('SELECT github_user_id, github_login, expires_at FROM sessions WHERE token_hash = ? AND expires_at > ?')
        .bind(await sha256(token), now()).first<Session>();
    if (!row || row.github_user_id !== env.ADMIN_GITHUB_USER_ID) throw new HttpError(401, 'unauthorized');
    return row;
}

export function requireSameOrigin(request: Request, env: Env): void {
    if (request.headers.get('Origin') !== configuredOrigin(env)) throw new HttpError(403, 'invalid_origin');
}

export function json(body: unknown, status = 200): Response {
    return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function protect(response: Response): Response {
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'no-referrer');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
