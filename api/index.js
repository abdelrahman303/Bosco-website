import { handle } from 'hono/vercel';
import app from '../server/app.js';

export const runtime = 'nodejs';
export const maxDuration = 30;

const handler = handle(app);

// Named method exports — Vercel Web Handler API (not legacy req/res).
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
