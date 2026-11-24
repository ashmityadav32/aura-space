import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
// SQLite database (data/aura.db). Same read/write API as before, so routes are unchanged.
// Each collection is a table: users, bookings, messages, resets.
let db;
const conn = () => { if (!db) { fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true }); db = new Database(path.join(process.cwd(), 'data', 'aura.db')); db.pragma('journal_mode = WAL'); } return db; };
const table = (n) => { if (!/^(users|bookings|messages|resets|chats)$/.test(n)) throw new Error('Unknown collection'); conn().exec(`CREATE TABLE IF NOT EXISTS ${n} (pos INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT UNIQUE NOT NULL, data TEXT NOT NULL)`); return n; };
export const read = (n) => conn().prepare(`SELECT data FROM ${table(n)} ORDER BY pos`).all().map((r) => JSON.parse(r.data));
export const write = (n, rows) => { const d = conn(), t = table(n); d.transaction(() => { d.exec(`DELETE FROM ${t}`); const ins = d.prepare(`INSERT INTO ${t} (id, data) VALUES (?, ?)`); rows.forEach((r) => ins.run(String(r.id), JSON.stringify(r))); })(); };
