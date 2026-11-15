PRAGMA foreign_keys = ON;

CREATE TABLE sessions (
    token_hash TEXT PRIMARY KEY,
    github_user_id TEXT NOT NULL,
    github_login TEXT NOT NULL,
    expires_at INTEGER NOT NULL
);
CREATE INDEX sessions_expiry ON sessions(expires_at);

CREATE TABLE oauth_states (
    state_hash TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL
);
CREATE INDEX oauth_states_expiry ON oauth_states(expires_at);

CREATE TABLE drafts (
    content_type TEXT NOT NULL CHECK (content_type IN ('item', 'project', 'quote', 'profile')),
    content_id TEXT NOT NULL,
    payload TEXT NOT NULL CHECK (json_valid(payload)),
    version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (content_type, content_id)
);

CREATE TABLE assets (
    id TEXT PRIMARY KEY,
    mime_type TEXT NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
    content BLOB NOT NULL CHECK (length(content) <= 524288),
    sha256 TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE draft_assets (
    content_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,
    PRIMARY KEY (content_type, content_id, asset_id),
    FOREIGN KEY (content_type, content_id) REFERENCES drafts(content_type, content_id) ON DELETE CASCADE
);

CREATE TABLE publications (
    id TEXT PRIMARY KEY,
    content_type TEXT NOT NULL CHECK (content_type IN ('item', 'project', 'quote', 'profile')),
    content_id TEXT NOT NULL,
    draft_version INTEGER,
    snapshot TEXT NOT NULL CHECK (json_valid(snapshot)),
    operation TEXT NOT NULL CHECK (operation IN ('upsert', 'delete')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'committed', 'deploying', 'published', 'failed', 'unconfirmed')),
    commit_sha TEXT,
    error_code TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE INDEX publications_status ON publications(status, updated_at);

CREATE TABLE publication_assets (
    publication_id TEXT NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,
    PRIMARY KEY (publication_id, asset_id)
);

CREATE TABLE publication_lock (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    publication_id TEXT NOT NULL REFERENCES publications(id),
    expires_at INTEGER NOT NULL
);
