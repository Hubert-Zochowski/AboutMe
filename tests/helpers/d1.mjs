import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

// Real SQLite, same migrations and SQL queries; no network or authentication bypass.
export function createDatabase() {
    const sqlite = new DatabaseSync(':memory:');
    sqlite.exec(readFileSync(new URL('../../worker/migrations/0001_initial.sql', import.meta.url), 'utf8'));
    const db = {
        sqlite,
        prepare(sql) {
            const statement = sqlite.prepare(sql);
            let bindings = [];
            return {
                bind(...values) { bindings = values; return this; },
                async first() { return statement.get(...bindings) ?? null; },
                async run() {
                    const result = statement.run(...bindings);
                    return { success: true, meta: { changes: Number(result.changes) } };
                }
            };
        },
        async batch(statements) {
            sqlite.exec('BEGIN');
            try {
                const results = [];
                for (const statement of statements) results.push(await statement.run());
                sqlite.exec('COMMIT');
                return results;
            } catch (error) { sqlite.exec('ROLLBACK'); throw error; }
        }
    };
    return db;
}
