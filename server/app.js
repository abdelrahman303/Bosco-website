import fs from 'node:fs';
import path from 'node:path';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { bodyLimit } from 'hono/body-limit';
import { queries, UPLOAD_DIR } from './db.js';
import { requireAdmin } from './lib/auth.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import subcategoryRoutes from './routes/subcategories.js';
import productRoutes from './routes/products.js';
import uploadRoutes from './routes/upload.js';
import inquiryRoutes from './routes/inquiries.js';

const app = new Hono();

const extraOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

function corsOrigin(origin) {
  if (!origin) return origin;
  const allowed = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://rana-fathi-m.github.io',
    'https://abdelrahman303.github.io',
    ...extraOrigins,
  ]);
  if (allowed.has(origin)) return origin;
  try {
    const host = new URL(origin).hostname;
    if (host.endsWith('.github.io')) return origin;
  } catch {
    return null;
  }
  return null;
}

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: corsOrigin,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/api/health', (c) => c.json({ ok: true, service: 'bosco-api' }));

app.get('/api/admin/stats', requireAdmin, (c) => {
  return c.json({
    data: {
      categories: queries.countCategories.get().count,
      subcategories: queries.countSubcategories.get().count,
      products: queries.countProducts.get().count,
      published: queries.countPublished.get().count,
      featured: queries.countFeatured.get().count,
      inquiries: queries.countInquiries.get().count,
    },
  });
});

app.route('/api/auth', authRoutes);
app.route('/api/categories', categoryRoutes);
app.route('/api/subcategories', subcategoryRoutes);
app.route('/api/products', productRoutes);
app.use('/api/admin/upload', bodyLimit({ maxSize: 12 * 1024 * 1024 }));
app.route('/api/admin/upload', uploadRoutes);
app.route('/api/inquiries', inquiryRoutes);

function serveUpload(c) {
  const file = c.req.param('file');
  if (!file || file.includes('..') || file.includes('/') || file.includes('\\')) {
    return c.notFound();
  }

  const filepath = path.join(UPLOAD_DIR, file);
  if (!fs.existsSync(filepath)) return c.notFound();

  const ext = path.extname(file).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
  };

  return new Response(fs.readFileSync(filepath), {
    headers: {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}

app.get('/uploads/:file', serveUpload);
app.get('/api/uploads/:file', serveUpload);

app.notFound((c) => c.json({ message: 'Route not found.' }, 404));
app.onError((error, c) => {
  console.error(error);
  return c.json({ message: error.message || 'Unexpected server error.' }, 500);
});

export default app;
