import { Hono } from 'hono';
import { queries } from '../db.js';
import { requireAdmin } from '../lib/auth.js';
import { toInt } from '../lib/http.js';

const inquiries = new Hono();

inquiries.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !email || !message) {
    return c.json({ message: 'Name, email, and message are required.' }, 400);
  }

  queries.insertInquiry.run(
    name,
    email,
    body.company || '',
    body.phone || '',
    message,
    toInt(body.product_id, null)
  );

  return c.json({ ok: true, message: 'Your inquiry has been received. Our team will contact you shortly.' }, 201);
});

inquiries.get('/', requireAdmin, (c) => {
  return c.json({ data: queries.allInquiries.all() });
});

export default inquiries;
