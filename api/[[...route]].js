import { handle } from 'hono/vercel';
import app from '../server/app.js';

export const config = {
  runtime: 'nodejs',
  maxDuration: 10,
};

export default handle(app);
