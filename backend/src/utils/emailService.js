const nodemailer = require('nodemailer');
const env = require('../config/env');
const { logger } = require('../infrastructure/observability/logger');

// Create reusable transporter object using the default SMTP transport
// Since we don't have real creds yet, we'll use a placeholder or Ethereal for dev
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'placeholder',
    pass: process.env.SMTP_PASS || 'placeholder',
  },
});

/**
 * Sends an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body
 */
async function sendEmail({ to, subject, text, html }) {
  // If no SMTP host configured, log and return
  if (!process.env.SMTP_HOST) {
    logger.warn('Email skipped: No SMTP host configured.', { to, subject });
    return { success: false, skipped: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Startups India" <${process.env.SMTP_FROM || 'noreply@startupsindia.in'}>`,
      to,
      subject,
      text,
      html,
    });

    logger.info('Email sent successfully', { messageId: info.messageId, to });
    return info;
  } catch (error) {
    logger.error('Error sending email', error);
    return null;
  }
}

module.exports = { sendEmail };
