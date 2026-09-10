import db from '../db.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS email_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    to_email TEXT NOT NULL,
    cc_email TEXT DEFAULT '',
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    recipient_name TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'sent',
    error_message TEXT DEFAULT '',
    message_id TEXT DEFAULT '',
    sent_by TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const insertLog = db.prepare(`
  INSERT INTO email_logs (
    to_email, cc_email, subject, content, recipient_name, status, error_message, message_id, sent_by
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const listLogs = db.prepare(`
  SELECT id, to_email, cc_email, subject, content, recipient_name, status, error_message, message_id, sent_by, created_at
  FROM email_logs
  ORDER BY id DESC
  LIMIT 100
`);

const getLog = db.prepare(`
  SELECT id, to_email, cc_email, subject, content, recipient_name, status, error_message, message_id, sent_by, created_at
  FROM email_logs
  WHERE id = ?
`);

export function logEmailAttempt({
  to,
  cc = '',
  subject,
  content,
  recipientName = '',
  status = 'sent',
  errorMessage = '',
  messageId = '',
  sentBy = '',
}) {
  insertLog.run(
    to,
    cc || '',
    subject,
    content || '',
    recipientName || '',
    status,
    errorMessage || '',
    messageId || '',
    sentBy || ''
  );
}

export function listEmailLogs() {
  return listLogs.all();
}

export function getEmailLog(id) {
  return getLog.get(Number(id)) || null;
}
