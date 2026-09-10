/**
 * Create a new admin user in bosco.db
 *
 * Usage:
 *   node --experimental-sqlite --env-file=.env scripts/create-admin.js email password "Full Name"
 *
 * Example:
 *   node --experimental-sqlite scripts/create-admin.js bosco.intertrade@outlook.com MyPass123 "Bosco Admin"
 */
import bcrypt from 'bcryptjs';
import { DatabaseSync } from 'node:sqlite';

const [emailArg, passwordArg, nameArg] = process.argv.slice(2);

if (!emailArg || !passwordArg) {
  console.error('Usage: node --experimental-sqlite scripts/create-admin.js <email> <password> ["Full Name"]');
  process.exit(1);
}

const email = String(emailArg).trim().toLowerCase();
const password = String(passwordArg);
const name = String(nameArg || 'Bosco Admin').trim();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Invalid email.');
  process.exit(1);
}
if (password.length < 6) {
  console.error('Password must be at least 6 characters.');
  process.exit(1);
}

const db = new DatabaseSync('server/data/bosco.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const existing = db.prepare('SELECT id, email, name FROM admins WHERE email = ?').get(email);
if (existing) {
  console.error(`Admin already exists: ${existing.email} (id ${existing.id})`);
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
const result = db.prepare('INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)').run(
  email,
  hash,
  name
);

console.log('Admin created successfully:');
console.log({
  id: Number(result.lastInsertRowid),
  email,
  name,
});

console.log('\nAll admins:');
console.log(db.prepare('SELECT id, email, name, created_at FROM admins ORDER BY id').all());
