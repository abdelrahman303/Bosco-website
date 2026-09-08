import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import app from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || '0.0.0.0';

serve({ fetch: app.fetch, port: PORT, hostname: HOST }, (info) => {
  console.log(`Bosco API running at http://${HOST}:${info.port}`);
  console.log(`Catalog data seeded at ${path.join(__dirname, 'data', 'bosco.db')}`);
});
