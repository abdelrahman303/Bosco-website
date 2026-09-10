import { Hono } from 'hono';
import { requireAdmin } from '../lib/auth.js';
import { getMailConfig, sendBoscoEmail, verifyMailTransport } from '../lib/mailer.js';
import { getEmailLog, listEmailLogs, logEmailAttempt } from '../lib/emailLog.js';

const mail = new Hono();

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

async function sendAndLog({ to, cc, subject, content, recipientName, sentBy }) {
  try {
    const result = await sendBoscoEmail({ to, cc, subject, content, recipientName });
    logEmailAttempt({
      to,
      cc,
      subject,
      content,
      recipientName,
      status: 'sent',
      messageId: result.messageId || '',
      sentBy,
    });
    return { ok: true, result };
  } catch (error) {
    logEmailAttempt({
      to,
      cc,
      subject,
      content,
      recipientName,
      status: 'failed',
      errorMessage: error.message || 'Send failed',
      sentBy,
    });
    throw error;
  }
}

mail.get('/status', requireAdmin, async (c) => {
  try {
    const status = await verifyMailTransport();
    return c.json({ data: status });
  } catch (error) {
    const config = getMailConfig();
    return c.json({
      data: {
        ok: false,
        configured: config.configured,
        mode: config.mode,
        from: config.fromEmail,
        message: error.message,
      },
    });
  }
});

mail.get('/history', requireAdmin, (c) => {
  return c.json({ data: listEmailLogs() });
});

mail.get('/history/:id', requireAdmin, (c) => {
  const row = getEmailLog(c.req.param('id'));
  if (!row) return c.json({ message: 'Email log not found.' }, 404);
  return c.json({ data: row });
});

mail.post('/send', requireAdmin, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const to = String(body.to || '').trim();
  const cc = String(body.cc || '').trim();
  const subject = String(body.subject || '').trim();
  const content = String(body.content || '').trim();
  const recipientName = String(body.recipientName || body.recipient_name || '').trim();
  const admin = c.get('admin');

  if (!to || !isValidEmail(to)) {
    return c.json({ message: 'Please enter a valid recipient email.' }, 400);
  }
  if (cc && !isValidEmail(cc)) {
    return c.json({ message: 'Please enter a valid CC email.' }, 400);
  }
  if (!subject || subject.length < 3) {
    return c.json({ message: 'Subject must be at least 3 characters.' }, 400);
  }
  if (!content || content.length < 10) {
    return c.json({ message: 'Message content must be at least 10 characters.' }, 400);
  }

  try {
    const { result } = await sendAndLog({
      to,
      cc,
      subject,
      content,
      recipientName,
      sentBy: admin?.email || '',
    });
    return c.json({ message: 'Email sent successfully.', data: result });
  } catch (error) {
    return c.json(
      {
        message:
          error.message ||
          'Failed to send email. Configure Microsoft Graph (npm run mail:auth).',
      },
      500
    );
  }
});

mail.post('/resend/:id', requireAdmin, async (c) => {
  const row = getEmailLog(c.req.param('id'));
  if (!row) return c.json({ message: 'Email log not found.' }, 404);
  if (!row.content || String(row.content).trim().length < 3) {
    return c.json({ message: 'This email log has no content to resend.' }, 400);
  }

  const admin = c.get('admin');
  try {
    const { result } = await sendAndLog({
      to: row.to_email,
      cc: row.cc_email || '',
      subject: row.subject,
      content: row.content,
      recipientName: row.recipient_name || '',
      sentBy: admin?.email || 'resend',
    });
    return c.json({ message: 'Email resent successfully.', data: result });
  } catch (error) {
    return c.json({ message: error.message || 'Failed to resend email.' }, 500);
  }
});

export default mail;
