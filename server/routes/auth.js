import { Hono } from 'hono';
import { queries } from '../db.js';
import { checkPassword, requireAdmin, signAdmin } from '../lib/auth.js';
import { publicAdmin } from '../lib/http.js';

const auth = new Hono();

auth.post('/login', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !password) {
    return c.json({ message: 'Email and password are required.' }, 400);
  }

  const admin = queries.adminByEmail.get(email);
  if (!admin || !checkPassword(password, admin.password_hash)) {
    return c.json({ message: 'Invalid email or password.' }, 401);
  }

  return c.json({
    token: signAdmin(admin),
    admin: publicAdmin(admin),
  });
});

auth.get('/me', requireAdmin, (c) => {
  return c.json({ admin: publicAdmin(c.get('admin')) });
});

export default auth;
