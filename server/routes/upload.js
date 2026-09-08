import fs from 'node:fs';
import path from 'node:path';
import { Hono } from 'hono';
import { requireAdmin } from '../lib/auth.js';
import { UPLOAD_DIR } from '../db.js';

const upload = new Hono();

const ALLOWED = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/bmp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.bmp']);

upload.post('/', requireAdmin, async (c) => {
  const body = await c.req.parseBody({ all: true });
  const file = body.file;

  if (!file || typeof file === 'string') {
    return c.json({ message: 'Please choose an image file.' }, 400);
  }

  const ext = path.extname(file.name || '').toLowerCase() || '.jpg';
  const typeOk = !file.type || file.type.startsWith('image/') || ALLOWED.has(file.type);
  if (!typeOk || (ext && !ALLOWED_EXT.has(ext))) {
    return c.json({ message: 'Only JPG, PNG, WEBP, GIF, or AVIF images are allowed.' }, 400);
  }
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  const fromEnv = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
  const proto = c.req.header('x-forwarded-proto') || 'https';
  const host = c.req.header('x-forwarded-host') || c.req.header('host') || '';
  const origin = fromEnv || (host ? `${proto}://${host}` : '');
  const url = origin ? `${origin}/uploads/${filename}` : `/uploads/${filename}`;

  return c.json({ url });
});

export default upload;
