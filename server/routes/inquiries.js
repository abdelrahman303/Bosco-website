import { Hono } from 'hono';
import { mapInquiry, queries } from '../db.js';
import { requireAdmin } from '../lib/auth.js';
import { toInt } from '../lib/http.js';
import { getMailConfig, sendBoscoEmail } from '../lib/mailer.js';
import { logEmailAttempt } from '../lib/emailLog.js';

const inquiries = new Hono();

const COMPANY_EMAIL =
  process.env.ADMIN_QUOTE_EMAIL ||
  process.env.SMTP_FROM ||
  'bosco.intertrade@outlook.com';

function siteBase() {
  return (process.env.PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || 'http://localhost:5173').replace(
    /\/$/,
    ''
  );
}

function formatPriceLine(product) {
  if (!product) return 'Price on request';
  if (product.price_on_request || product.price == null) return 'Price on request';
  const amount = Number(product.price);
  if (!Number.isFinite(amount)) return 'Price on request';
  return `${amount.toLocaleString('en-US')} ${product.currency || 'USD'}`;
}

async function sendLoggedEmail(payload, sentBy = 'system') {
  try {
    const result = await sendBoscoEmail(payload);
    logEmailAttempt({
      ...payload,
      to: payload.to,
      cc: payload.cc || '',
      recipientName: payload.recipientName || '',
      status: 'sent',
      messageId: result.messageId || '',
      sentBy,
    });
    return result;
  } catch (error) {
    logEmailAttempt({
      to: payload.to,
      cc: payload.cc || '',
      subject: payload.subject,
      content: payload.content,
      recipientName: payload.recipientName || '',
      status: 'failed',
      errorMessage: error.message || 'Send failed',
      sentBy,
    });
    throw error;
  }
}

async function notifyCompany(inquiry, kind) {
  const product = inquiry.product;
  const isContact = kind === 'contact';
  const lines = [
    isContact
      ? 'A new contact form message was submitted on the Bosco website.'
      : 'A new quote request was submitted on the Bosco website.',
    '',
    '— Customer —',
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Company: ${inquiry.company || '—'}`,
    `Phone: ${inquiry.phone || '—'}`,
    '',
    '— Message —',
    inquiry.message,
  ];

  if (product) {
    lines.push(
      '',
      '— Requested product —',
      `Product: ${product.name}`,
      `Model: ${product.model || '—'}`,
      `SKU: ${product.sku || '—'}`,
      `Category: ${product.category?.name || '—'}`,
      `Brand: ${product.brand || '—'}`,
      `Origin: ${product.origin || '—'}`,
      `Capacity: ${product.capacity || '—'}`,
      `Power: ${product.power || '—'}`,
      `Dimensions: ${product.dimensions || '—'}`,
      `Warranty: ${product.warranty || '—'}`,
      `Price: ${formatPriceLine(product)}`,
      `Link: ${siteBase()}/products/${product.slug}`,
      '',
      product.short_description || product.description || ''
    );
  } else if (!isContact) {
    lines.push('', '— Requested product —', 'General quote (no specific product selected).');
  }

  lines.push('', `Open in admin: ${siteBase()}/admin/quotes`);

  const subject = isContact
    ? `New contact message · ${inquiry.name}`
    : product
      ? `New quote request · ${product.name}`
      : `New quote request · ${inquiry.name}`;

  await sendLoggedEmail(
    {
      to: COMPANY_EMAIL,
      subject,
      content: lines.join('\n'),
      recipientName: 'Bosco Team',
      replyTo: inquiry.email,
    },
    isContact ? 'contact-form' : 'quote-form'
  );
}

async function notifyCustomerQuoteReceived(inquiry) {
  const productLine = inquiry.product
    ? `Product: ${inquiry.product.name}`
    : 'Request type: General quotation';

  const content = [
    'Thank you for contacting Bosco International Trade.',
    '',
    'We have received your quotation request and our team will review it shortly.',
    'One of our specialists will contact you soon with the next steps.',
    '',
    productLine,
    '',
    'If you need anything urgent, you can also reach us on WhatsApp: +20 12 7771 2790',
    'or email bosco.intertrade@outlook.com.',
  ].join('\n');

  await sendLoggedEmail(
    {
      to: inquiry.email,
      subject: 'We received your quote request · Bosco International Trade',
      content,
      recipientName: inquiry.name,
    },
    'quote-confirmation'
  );
}

inquiries.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  const productId = toInt(body.product_id, null);
  const kind = String(body.type || body.kind || 'quote').trim().toLowerCase() === 'contact'
    ? 'contact'
    : 'quote';

  if (!name || !email || !message) {
    return c.json({ message: 'Name, email, and message are required.' }, 400);
  }

  if (productId && !queries.productById.get(productId)) {
    return c.json({ message: 'Selected product was not found.' }, 400);
  }

  const result = queries.insertInquiry.run(
    name,
    email,
    body.company || '',
    body.phone || '',
    message,
    productId
  );

  const inquiry = mapInquiry(queries.inquiryById.get(Number(result.lastInsertRowid)));

  let emailSent = false;
  let customerEmailSent = false;
  let emailError = '';

  try {
    const mail = getMailConfig();
    if (!mail.configured) {
      emailError =
        'Email is not configured. Set MICROSOFT_CLIENT_ID + MICROSOFT_REFRESH_TOKEN (npm run mail:auth).';
    } else {
      await notifyCompany(inquiry, kind);
      emailSent = true;
      if (kind === 'quote') {
        await notifyCustomerQuoteReceived(inquiry);
        customerEmailSent = true;
      }
    }
  } catch (error) {
    emailError = error.message || 'Failed to send notification email.';
    console.error('[inquiry-email]', error);
  }

  return c.json(
    {
      ok: true,
      message:
        kind === 'contact'
          ? 'Your message has been received. Our team will contact you shortly.'
          : 'Your inquiry has been received. Our team will contact you shortly.',
      data: inquiry,
      emailSent,
      customerEmailSent,
      emailError: emailSent ? undefined : emailError || undefined,
    },
    201
  );
});

inquiries.get('/', requireAdmin, (c) => {
  return c.json({ data: queries.allInquiries.all().map(mapInquiry) });
});

inquiries.get('/:id', requireAdmin, (c) => {
  const inquiry = mapInquiry(queries.inquiryById.get(Number(c.req.param('id'))));
  if (!inquiry) return c.json({ message: 'Quote not found.' }, 404);
  return c.json({ data: inquiry });
});

inquiries.patch('/:id/status', requireAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const existing = queries.inquiryById.get(id);
  if (!existing) return c.json({ message: 'Quote not found.' }, 404);

  const body = await c.req.json().catch(() => ({}));
  const status = String(body.status || '').trim().toLowerCase();
  const allowed = new Set(['new', 'reviewed', 'contacted', 'closed']);
  if (!allowed.has(status)) {
    return c.json({ message: 'Invalid status.' }, 400);
  }

  queries.updateInquiryStatus.run(status, id);
  return c.json({ data: mapInquiry(queries.inquiryById.get(id)) });
});

export default inquiries;
