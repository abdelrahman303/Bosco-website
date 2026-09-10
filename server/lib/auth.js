import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { queries } from '../db.js';

const isProd = process.env.NODE_ENV === 'production';
const DEV_JWT_FALLBACK = 'bosco-dev-secret-change-me';

function resolveSecret(name, fallback) {
  const value = (process.env[name] || '').trim();
  if (value) return value;
  if (isProd) {
    throw new Error(`${name} must be set in production.`);
  }
  console.warn(`[auth] ${name} missing — using insecure development fallback.`);
  return fallback;
}

const JWT_SECRET = resolveSecret('JWT_SECRET', DEV_JWT_FALLBACK);
const JWT_REFRESH_SECRET = resolveSecret('JWT_REFRESH_SECRET', `${JWT_SECRET}-refresh`);
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

db.exec(`
  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    revoked INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
  );
`);

const insertRefresh = db.prepare(`
  INSERT INTO refresh_tokens (admin_id, token_hash, expires_at)
  VALUES (?, ?, ?)
`);
const findRefresh = db.prepare(`
  SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked = 0
`);
const revokeRefresh = db.prepare(`
  UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?
`);
const revokeAllForAdmin = db.prepare(`
  UPDATE refresh_tokens SET revoked = 1 WHERE admin_id = ? AND revoked = 0
`);

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function refreshExpiryDate() {
  const match = String(REFRESH_EXPIRES).match(/^(\d+)([smhd])$/i);
  const amount = match ? Number(match[1]) : 7;
  const unit = match ? match[2].toLowerCase() : 'd';
  const ms =
    unit === 's'
      ? amount * 1000
      : unit === 'm'
        ? amount * 60 * 1000
        : unit === 'h'
          ? amount * 60 * 60 * 1000
          : amount * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms).toISOString();
}

export function signAccessToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name, role: 'admin', type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
}

export function signRefreshToken(admin) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: 'admin', type: 'refresh', jti },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );
  insertRefresh.run(admin.id, hashToken(token), refreshExpiryDate());
  return token;
}

export function issueAdminTokens(admin) {
  const accessToken = signAccessToken(admin);
  const refreshToken = signRefreshToken(admin);
  return {
    accessToken,
    refreshToken,
    token: accessToken,
    expiresIn: ACCESS_EXPIRES,
    tokenType: 'Bearer',
  };
}

export function verifyToken(token) {
  const payload = jwt.verify(token, JWT_SECRET);
  if (payload.type && payload.type !== 'access') {
    throw new Error('Invalid access token.');
  }
  return payload;
}

export function rotateRefreshToken(refreshToken) {
  const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  if (payload.type !== 'refresh') {
    throw new Error('Invalid refresh token.');
  }

  const stored = findRefresh.get(hashToken(refreshToken));
  if (!stored) {
    throw new Error('Refresh token is invalid or revoked.');
  }
  if (new Date(stored.expires_at).getTime() < Date.now()) {
    revokeRefresh.run(hashToken(refreshToken));
    throw new Error('Refresh token expired.');
  }

  const admin = queries.adminById.get(payload.id);
  if (!admin) {
    throw new Error('Session is no longer valid.');
  }

  revokeRefresh.run(hashToken(refreshToken));
  return {
    admin,
    ...issueAdminTokens(admin),
  };
}

export function revokeRefreshToken(refreshToken) {
  if (!refreshToken) return;
  try {
    revokeRefresh.run(hashToken(refreshToken));
  } catch {
    /* ignore */
  }
}

export function revokeAdminSessions(adminId) {
  revokeAllForAdmin.run(adminId);
}

/** @deprecated use signAccessToken / issueAdminTokens */
export function signAdmin(admin) {
  return signAccessToken(admin);
}

export function checkPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export async function requireAdmin(c, next) {
  const header = c.req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return c.json({ message: 'Please sign in to continue.' }, 401);
  }

  try {
    const payload = verifyToken(token);
    const admin = queries.adminById.get(payload.id);
    if (!admin) return c.json({ message: 'Session is no longer valid.' }, 401);
    c.set('admin', admin);
    await next();
  } catch {
    return c.json({ message: 'Session expired. Please sign in again.' }, 401);
  }
}
