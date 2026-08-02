const dotenv = require('dotenv');

dotenv.config();

const env = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '',
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || '',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  // Secret path segment for all admin API routes. Must not be 'admin' or any common slug.
  ADMIN_SLUG: process.env.ADMIN_SLUG || 'ctrl-x9k2m3-panel',

  // Public origin of the Next.js app - used to build password-reset links.
  FRONTEND_URL: (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, ''),

  // Public origin of THIS API - used to build CRM open/click/unsubscribe URLs
  // that recipients' email clients hit. Must be publicly reachable in prod.
  API_PUBLIC_URL: (process.env.API_PUBLIC_URL || 'http://localhost:5000').replace(/\/+$/, ''),
  // Global ceiling on marketing emails sent per rolling 24h.
  CRM_DAILY_CAP: Number(process.env.CRM_DAILY_CAP || 100),

  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@startupsindia.in',
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@startupsindia.in',

  // Password reset tuning.
  PASSWORD_RESET_TTL_MINUTES: Number(process.env.PASSWORD_RESET_TTL_MINUTES || 30),
  // Minimum gap between two reset emails for the same account (anti-mailbomb).
  PASSWORD_RESET_COOLDOWN_SECONDS: Number(process.env.PASSWORD_RESET_COOLDOWN_SECONDS || 60),

  // ─── SMS / PHONE OTP ──────────────────────────────────────────────────
  // Global kill-switch for SMS two-factor. Default OFF (paused) while SMS
  // delivery is being sorted out. When false, login never issues a 2FA
  // challenge - so a user who already enabled 2FA is NOT locked out by an SMS
  // they can't receive. Flip to 'true' to switch the whole flow back on.
  TWO_FACTOR_ENABLED: process.env.TWO_FACTOR_ENABLED === 'true',

  // 'msg91' in production; 'console' prints the OTP to the terminal for local dev.
  SMS_PROVIDER: process.env.SMS_PROVIDER || 'console',
  MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY || '',
  MSG91_SENDER_ID: process.env.MSG91_SENDER_ID || '',
  // DLT-approved template ID. Sending transactional SMS to Indian numbers without
  // a registered DLT template is rejected by the carriers, not just by MSG91.
  MSG91_TEMPLATE_ID: process.env.MSG91_TEMPLATE_ID || '',

  // Default country for bare 10-digit numbers typed by Indian users.
  DEFAULT_PHONE_COUNTRY: process.env.DEFAULT_PHONE_COUNTRY || 'IN',

  TWOFACTOR_API_KEY: process.env.TWOFACTOR_API_KEY || '16ac4ef8-8a8a-11f1-908b-0200cd936042',
  TWOFACTOR_TEMPLATE_NAME: process.env.TWOFACTOR_TEMPLATE_NAME || '',

  OTP_LENGTH: Number(process.env.OTP_LENGTH || 6),
  OTP_TTL_MINUTES: Number(process.env.OTP_TTL_MINUTES || 5),
  // A 6-digit code is only ~1M wide, so the attempt cap is what actually secures
  // it - not the code length. Burn the challenge after this many wrong guesses.
  OTP_MAX_ATTEMPTS: Number(process.env.OTP_MAX_ATTEMPTS || 5),
  OTP_RESEND_COOLDOWN_SECONDS: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60),
  OTP_MAX_SENDS_PER_HOUR: Number(process.env.OTP_MAX_SENDS_PER_HOUR || 5),
  // Separate secret for HMAC-ing OTP codes at rest. Falls back to the JWT secret
  // so nothing breaks if it is unset, but give it its own value in production.
  OTP_PEPPER: process.env.OTP_PEPPER || process.env.JWT_ACCESS_SECRET || '',
};

const required = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
for (const key of required) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// In production a reset link that points at localhost is a silent, user-facing
// breakage - fail fast at boot instead of mailing dead links.
if (env.NODE_ENV === 'production') {
  if (env.FRONTEND_URL.includes('localhost')) {
    throw new Error('FRONTEND_URL must be set to the public site origin in production');
  }
  if (!env.SMTP_HOST) {
    throw new Error('SMTP_HOST must be configured in production (password reset depends on it)');
  }
  // SMS config is only enforced when 2FA is actually switched on. While it's
  // paused, a production box shouldn't be forced to carry MSG91 credentials for
  // a flow that never runs.
  if (env.TWO_FACTOR_ENABLED) {
    // The console driver prints OTPs to stdout. If that ever ran in production it
    // would mean every 2FA code is sitting in the logs and no SMS is being sent.
    if (env.SMS_PROVIDER === 'console') {
      throw new Error('SMS_PROVIDER must not be "console" when TWO_FACTOR_ENABLED - set it to "msg91" or "2factor"');
    }
    if (env.SMS_PROVIDER === 'msg91' && !env.MSG91_AUTH_KEY) {
      throw new Error('MSG91_AUTH_KEY is required when SMS_PROVIDER=msg91');
    }
    if ((env.SMS_PROVIDER === '2factor' || env.SMS_PROVIDER === 'twofactor') && !env.TWOFACTOR_API_KEY) {
      throw new Error('TWOFACTOR_API_KEY is required when SMS_PROVIDER=2factor');
    }
  }
}

module.exports = env;
