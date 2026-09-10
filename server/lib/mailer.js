/**
 * Free mail providers (pick ONE):
 * 1) Brevo (recommended, free ~300/day) — SMTP works, can send as bosco.intertrade@outlook.com after verify
 * 2) Resend (free ~100/day) — API key; free tier often uses onboarding@resend.dev unless domain verified
 * 3) Microsoft Graph OAuth — Outlook native, free but harder setup
 * 4) Generic SMTP — only if ALLOW_SMTP_BASIC=true (Gmail app password, etc.)
 */
const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || 'bosco.intertrade@outlook.com';
const FROM_NAME = process.env.SMTP_FROM_NAME || 'Bosco International Trade';

const GRAPH_SCOPE = 'https://graph.microsoft.com/Mail.Send offline_access User.Read';

function env(name) {
  return String(process.env[name] || '').trim();
}

export function getMailConfig() {
  const brevoKey = env('BREVO_SMTP_KEY') || env('BREVO_API_KEY');
  const brevoLogin = env('BREVO_SMTP_USER') || env('BREVO_LOGIN') || 'bosco.intertrade@outlook.com';
  const resendKey = env('RESEND_API_KEY');
  const clientId = env('MICROSOFT_CLIENT_ID');
  const clientSecret = env('MICROSOFT_CLIENT_SECRET');
  const refreshToken = env('MICROSOFT_REFRESH_TOKEN');
  const tenant = env('MICROSOFT_TENANT_ID') || 'consumers';
  const allowSmtp = String(process.env.ALLOW_SMTP_BASIC || '').toLowerCase() === 'true';

  const graphConfigured = Boolean(clientId && refreshToken);
  const brevoConfigured = Boolean(brevoKey);
  const resendConfigured = Boolean(resendKey);

  let host = env('SMTP_HOST');
  let port = Number(env('SMTP_PORT') || 587);
  let secure = String(env('SMTP_SECURE') || 'false') === 'true';
  let user = env('SMTP_USER') || FROM_EMAIL;
  let pass = env('SMTP_PASS');

  if (brevoConfigured) {
    host = host || 'smtp-relay.brevo.com';
    port = Number(env('SMTP_PORT') || 587);
    user = brevoLogin;
    pass = brevoKey;
  }

  const smtpConfigured = Boolean(user && pass && (brevoConfigured || allowSmtp || host));
  const configured = brevoConfigured || resendConfigured || graphConfigured || (allowSmtp && Boolean(user && pass));

  let mode = 'none';
  if (brevoConfigured) mode = 'brevo';
  else if (resendConfigured) mode = 'resend';
  else if (graphConfigured) mode = 'graph';
  else if (allowSmtp && user && pass) mode = 'smtp';

  return {
    host: host || 'smtp-relay.brevo.com',
    port,
    secure,
    user,
    pass,
    fromEmail: FROM_EMAIL.trim(),
    fromName: FROM_NAME.trim(),
    clientId,
    clientSecret,
    refreshToken,
    tenant,
    resendKey,
    mode,
    configured,
    graphConfigured,
    brevoConfigured,
    resendConfigured,
    smtpConfigured,
    allowSmtp,
  };
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function plainToHtml(content = '') {
  return escapeHtml(content).replace(/\n/g, '<br />');
}

export function buildEmailHtml({ subject, content, recipientName }) {
  const safeSubject = escapeHtml(subject);
  const body = plainToHtml(content);
  const greeting = recipientName
    ? `Dear ${escapeHtml(recipientName)},`
    : 'Hello,';
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f3f0;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f3f0;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#111111 0%,#1f1f1f 55%,#C63637 160%);padding:28px 32px;">
              <p style="margin:0;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.72);font-weight:700;">Bosco International Trade</p>
              <h1 style="margin:10px 0 0;font-size:26px;line-height:1.25;color:#ffffff;font-weight:800;">${safeSubject}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#374151;">${greeting}</p>
              <div style="font-size:15px;line-height:1.8;color:#1f2937;">${body}</div>
              <div style="margin-top:28px;padding-top:22px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;">
                  Warm regards,<br />
                  <strong style="color:#111827;">Bosco International Trade</strong><br />
                  <a href="mailto:${escapeHtml(FROM_EMAIL)}" style="color:#C63637;text-decoration:none;">${escapeHtml(FROM_EMAIL)}</a>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#111111;padding:18px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(255,255,255,0.65);">
                © ${year} Bosco International Trade · Industrial machinery, materials & global supply
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText({ content, recipientName, fromEmail }) {
  return [
    recipientName ? `Dear ${recipientName},` : 'Hello,',
    '',
    content,
    '',
    'Warm regards,',
    'Bosco International Trade',
    fromEmail,
  ].join('\n');
}

async function acquireGraphAccessToken(config) {
  const authority = `https://login.microsoftonline.com/${config.tenant}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: config.clientId,
    grant_type: 'refresh_token',
    refresh_token: config.refreshToken,
    scope: GRAPH_SCOPE,
  });
  if (config.clientSecret) body.set('client_secret', config.clientSecret);

  const response = await fetch(authority, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    const detail = data.error_description || data.error || response.statusText;
    throw new Error(`Microsoft Graph auth failed: ${detail}`);
  }
  return data.access_token;
}

function toRecipientList(value) {
  return String(value || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((address) => ({ emailAddress: { address } }));
}

async function sendViaGraph({ to, subject, content, recipientName, cc, replyTo }) {
  const config = getMailConfig();
  const accessToken = await acquireGraphAccessToken(config);
  const html = buildEmailHtml({ subject, content, recipientName });

  const message = {
    subject,
    body: { contentType: 'HTML', content: html },
    toRecipients: toRecipientList(to),
    from: {
      emailAddress: { address: config.fromEmail, name: config.fromName },
    },
  };
  if (cc) message.ccRecipients = toRecipientList(cc);
  if (replyTo || config.fromEmail) {
    message.replyTo = [{ emailAddress: { address: replyTo || config.fromEmail } }];
  }

  const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, saveToSentItems: true }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Microsoft Graph send failed: ${err?.error?.message || response.statusText}`);
  }

  return {
    messageId: `graph-${Date.now()}`,
    accepted: [to],
    rejected: [],
    from: config.fromEmail,
    mode: 'graph',
  };
}

async function sendViaResend({ to, subject, content, recipientName, cc, replyTo }) {
  const config = getMailConfig();
  const html = buildEmailHtml({ subject, content, recipientName });
  const text = buildText({ content, recipientName, fromEmail: config.fromEmail });

  const payload = {
    from: `${config.fromName} <${config.fromEmail}>`,
    to: [to],
    subject,
    html,
    text,
    reply_to: replyTo || config.fromEmail,
  };
  if (cc) payload.cc = [cc];

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error?.message ||
        `Resend failed (${response.status}). On free plan, verify a domain or use onboarding@resend.dev as SMTP_FROM.`
    );
  }

  return {
    messageId: data.id || `resend-${Date.now()}`,
    accepted: [to],
    rejected: [],
    from: config.fromEmail,
    mode: 'resend',
  };
}

async function sendViaSmtp({ to, subject, content, recipientName, cc, replyTo, mode = 'smtp' }) {
  const nodemailer = await import('nodemailer');
  const config = getMailConfig();
  if (!config.user || !config.pass) {
    throw new Error(
      'Email is not configured. Easiest free option: create a Brevo account, verify bosco.intertrade@outlook.com, set BREVO_SMTP_KEY in .env, restart API.'
    );
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.port === 587,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const html = buildEmailHtml({ subject, content, recipientName });
  const text = buildText({ content, recipientName, fromEmail: config.fromEmail });

  try {
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      cc: cc || undefined,
      replyTo: replyTo || config.fromEmail,
      subject,
      text,
      html,
    });

    return {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      from: config.fromEmail,
      mode,
    };
  } catch (error) {
    const message = String(error.message || error);
    if (message.includes('5.7.139') || /basic authentication is disabled/i.test(message)) {
      throw new Error(
        'Outlook SMTP is blocked. Use free Brevo instead: set BREVO_SMTP_KEY in .env (see .env.example).'
      );
    }
    throw error;
  }
}

export async function sendBoscoEmail({
  to,
  subject,
  content,
  recipientName = '',
  cc = '',
  replyTo = '',
}) {
  const config = getMailConfig();
  if (!config.configured) {
    throw new Error(
      'Email is not configured. Free & easy: sign up at brevo.com, verify bosco.intertrade@outlook.com, put BREVO_SMTP_KEY in .env, restart API.'
    );
  }

  if (config.brevoConfigured) {
    return sendViaSmtp({ to, subject, content, recipientName, cc, replyTo, mode: 'brevo' });
  }
  if (config.resendConfigured) {
    return sendViaResend({ to, subject, content, recipientName, cc, replyTo });
  }
  if (config.graphConfigured) {
    return sendViaGraph({ to, subject, content, recipientName, cc, replyTo });
  }
  return sendViaSmtp({ to, subject, content, recipientName, cc, replyTo, mode: 'smtp' });
}

export async function verifyMailTransport() {
  const config = getMailConfig();
  if (!config.configured) {
    return {
      ok: false,
      configured: false,
      mode: 'none',
      from: config.fromEmail,
      message:
        'Not configured. Free option: Brevo → verify sender email → set BREVO_SMTP_KEY in .env → restart API.',
    };
  }

  if (config.resendConfigured) {
    return {
      ok: true,
      configured: true,
      mode: 'resend',
      from: config.fromEmail,
      host: 'api.resend.com',
      message: 'Resend API key detected',
    };
  }

  if (config.graphConfigured) {
    await acquireGraphAccessToken(config);
    return {
      ok: true,
      configured: true,
      mode: 'graph',
      from: config.fromEmail,
      host: 'graph.microsoft.com',
      message: 'Microsoft Graph OAuth ready',
    };
  }

  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.port === 587,
    auth: { user: config.user, pass: config.pass },
  });
  await transporter.verify();
  return {
    ok: true,
    configured: true,
    mode: config.mode,
    from: config.fromEmail,
    host: config.host,
    message: config.brevoConfigured ? 'Brevo SMTP ready' : 'SMTP ready',
  };
}
