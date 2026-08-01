const env = require('../config/env');
const { logger } = require('../infrastructure/observability/logger');

// SMS delivery sits behind a driver interface so the OTP business logic never
// knows which vendor is in play. Swapping MSG91 for Twilio is one function here.

/**
 * Dev driver. Prints the message to the terminal instead of sending it, so the
 * whole 2FA flow is testable locally with no vendor account. env.js refuses to
 * boot with this driver in production.
 */
async function consoleDriver({ to, message }) {
  logger.warn('─────────────── [DEV SMS — not actually sent] ───────────────', {
    to,
    message,
  });
  return { provider: 'console', messageId: `dev-${Date.now()}` };
}

/**
 * MSG91 driver.
 *
 * Uses the Flow API, which sends a DLT-registered *template* plus variables —
 * not free-form text. Indian carriers reject transactional SMS whose template
 * isn't registered under TRAI's DLT regime, so `##OTP##` (or whatever variable
 * name your approved template declares) must line up with MSG91_TEMPLATE_ID.
 */
async function msg91Driver({ to, variables }) {
  const res = await fetch('https://control.msg91.com/api/v5/flow/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authkey: env.MSG91_AUTH_KEY,
    },
    body: JSON.stringify({
      template_id: env.MSG91_TEMPLATE_ID,
      sender: env.MSG91_SENDER_ID,
      short_url: '0',
      // MSG91 wants the number without the '+'.
      recipients: [{ mobiles: to.replace(/^\+/, ''), ...variables }],
    }),
  });

  const body = await res.json().catch(() => ({}));

  // MSG91 answers 200 with {type:'error'} for template/DLT problems, so a bare
  // res.ok check would report success while nothing was delivered.
  if (!res.ok || body.type === 'error') {
    const reason = body.message || `HTTP ${res.status}`;
    throw new Error(`MSG91 send failed: ${reason}`);
  }

  // On success the v5 flow API returns the request id in `message`
  // (e.g. {"message":"36676f…","type":"success"}) — NOT `request_id`. This id is
  // what you paste into MSG91's delivery report to trace a specific send.
  return { provider: 'msg91', messageId: body.request_id || body.message || null };
}

/**
 * 2Factor SMS driver.
 *
 * Uses the 2Factor custom OTP API syntax:
 * https://2factor.in/API/V1/{api_key}/SMS/{phone_number}/{otp_value}/{template_name}
 * template_name is optional. If provided, it overrides the default template.
 */
async function twoFactorDriver({ to, code }) {
  const apiKey = env.TWOFACTOR_API_KEY;
  if (!apiKey) {
    throw new Error('TWOFACTOR_API_KEY is not configured');
  }

  const cleanPhone = to.replace(/^\+/, '');
  const templateName = env.TWOFACTOR_TEMPLATE_NAME || '';
  
  let url = `https://2factor.in/API/V1/${apiKey}/SMS/${cleanPhone}/${code}`;
  if (templateName) {
    url += `/${templateName}`;
  }

  const res = await fetch(url, {
    method: 'GET'
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok || body.Status !== 'Success') {
    const reason = body.Details || `HTTP ${res.status}`;
    throw new Error(`2Factor send failed: ${reason}`);
  }

  return { provider: '2factor', messageId: body.Details || null };
}

const DRIVERS = {
  console: consoleDriver,
  msg91: msg91Driver,
  '2factor': twoFactorDriver,
  twofactor: twoFactorDriver,
};

/**
 * Send an OTP. Throws if delivery fails — the caller must not tell a user
 * "code sent" when it wasn't.
 *
 * @param {string} to      E.164 number
 * @param {string} code    the one-time code
 * @param {number} ttlMin  minutes until it expires (for the message body)
 */
async function sendOtpSms(to, code, ttlMin) {
  const driver = DRIVERS[env.SMS_PROVIDER];
  if (!driver) throw new Error(`Unknown SMS_PROVIDER: ${env.SMS_PROVIDER}`);

  const message = `${code} is your Startups India verification code. It expires in ${ttlMin} minutes. Do not share it with anyone.`;

  const result = await driver({
    to,
    message,
    code,
    // Variable names must match the DLT-approved template's placeholders.
    variables: { OTP: code, EXPIRY: String(ttlMin) },
  });

  // The code itself is never logged — only that a send happened.
  logger.info('OTP SMS dispatched', { provider: result.provider, messageId: result.messageId });
  return result;
}

module.exports = { sendOtpSms };
