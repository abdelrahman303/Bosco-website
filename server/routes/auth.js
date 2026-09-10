import { Hono } from 'hono';
import { queries } from '../db.js';
import {
  checkPassword,
  issueAdminTokens,
  requireAdmin,
  revokeRefreshToken,
  rotateRefreshToken,
} from '../lib/auth.js';
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

  const tokens = issueAdminTokens(admin);
  return c.json({
    ...tokens,
    admin: publicAdmin(admin),
  });
});

auth.post('/refresh', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const refreshToken = String(body.refreshToken || body.refresh_token || '').trim();

  if (!refreshToken) {
    return c.json({ message: 'Refresh token is required.' }, 400);
  }

  try {
    const result = rotateRefreshToken(refreshToken);
    return c.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      token: result.accessToken,
      expiresIn: result.expiresIn,
      tokenType: result.tokenType,
      admin: publicAdmin(result.admin),
    });
  } catch {
    return c.json({ message: 'Refresh token expired or invalid. Please sign in again.' }, 401);
  }
});

auth.post('/logout', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const refreshToken = String(body.refreshToken || body.refresh_token || '').trim();
  revokeRefreshToken(refreshToken);
  return c.json({ ok: true });
});

auth.get('/me', requireAdmin, (c) => {
  return c.json({ admin: publicAdmin(c.get('admin')) });
});

export default auth;
