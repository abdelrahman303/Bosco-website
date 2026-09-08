import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { queries } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bosco-dev-secret-change-me';
const JWT_EXPIRES = '7d';

export function signAdmin(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name, role: 'admin' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
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
