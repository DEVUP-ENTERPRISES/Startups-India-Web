'use strict';
const nodemailer = require('nodemailer');

let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return _transporter;
}

async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[Email] SMTP not configured — skipping');
    return { skipped: true };
  }
  const info = await transporter.sendMail({
    from: `"Startups India" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
  console.log(`[Email] Sent to ${to} — ${info.messageId}`);
  return { sent: 1, messageId: info.messageId };
}

async function _sendBulk(emails, payload, concurrency = 10) {
  let sent = 0, failed = 0;
  for (let i = 0; i < emails.length; i += concurrency) {
    const batch = emails.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(email => sendEmail({ to: email, ...payload }))
    );
    for (const r of results) {
      if (r.status === 'fulfilled' && !r.value?.skipped) sent++;
      else failed++;
    }
  }
  return { sent, failed };
}

async function sendToAll(payload) {
  const { User } = require('../modules/users/user.model');
  const users = await User.find({ email: { $exists: true, $ne: '' } }, 'email').lean();
  const emails = users.map(u => u.email).filter(Boolean);
  console.log(`[Email] sendToAll — ${emails.length} recipients`);
  const result = await _sendBulk(emails, payload);
  console.log(`[Email] Done — sent: ${result.sent}, failed: ${result.failed}`);
  return { ...result, total: emails.length };
}

async function sendToRole(role, payload) {
  const { User } = require('../modules/users/user.model');
  const users = await User.find({ role, email: { $exists: true, $ne: '' } }, 'email').lean();
  const emails = users.map(u => u.email).filter(Boolean);
  console.log(`[Email] sendToRole(${role}) — ${emails.length} recipients`);
  const result = await _sendBulk(emails, payload);
  console.log(`[Email] Done — sent: ${result.sent}, failed: ${result.failed}`);
  return { ...result, total: emails.length };
}

async function getEmailStats() {
  const { User } = require('../modules/users/user.model');
  const [total, roleAgg] = await Promise.all([
    User.countDocuments({ email: { $exists: true, $ne: '' } }),
    User.aggregate([
      { $match: { email: { $exists: true, $ne: '' } } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
  ]);
  const byRole = roleAgg.reduce((acc, r) => { acc[r._id] = r.count; return acc; }, {});
  return { total, byRole };
}

function isEmailConfigured() {
  return getTransporter() !== null;
}

/**
 * Strict send for transactional mail the user is actively waiting on (password
 * reset). Throws on failure so the caller can roll back the issued token rather
 * than telling the user "check your inbox" for a mail that never left.
 *
 * sendEmail() above is the best-effort variant: it silently returns {skipped:true}
 * with no SMTP, which is right for broadcasts but would strand a user mid-reset.
 *
 * In development with no SMTP configured, logs the message instead of failing so
 * the reset link can be copied straight out of the terminal.
 */
async function sendTransactionalEmail({ to, subject, text, html }) {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP is not configured; cannot send transactional email');
    }
    console.warn('[DEV] SMTP not configured — email not sent. Body follows.');
    console.warn(`[DEV]   to: ${to}\n[DEV]   subject: ${subject}\n[DEV]   ${text}`);
    return { skipped: true, dev: true };
  }

  return sendEmail({ to, subject, text, html });
}

module.exports = {
  sendEmail,
  sendToAll,
  sendToRole,
  getEmailStats,
  sendTransactionalEmail,
  isEmailConfigured,
};
