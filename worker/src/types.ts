export interface Env {
    DB: D1Database;
    ASSETS: Fetcher;
    APP_ORIGIN?: string;
    ADMIN_GITHUB_USER_ID?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
}

export interface Session {
    github_user_id: string;
    github_login: string;
    expires_at: number;
}
