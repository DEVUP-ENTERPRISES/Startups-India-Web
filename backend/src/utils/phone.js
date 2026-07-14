const env = require('../config/env');

// Phone numbers are stored in E.164 ("+919876543210") and nothing else. The
// existing free-text `phone` field on User is exactly why: it accumulated values
// like "0130220500" and "3534543543" that cannot receive an SMS. A number that
// is a *login credential* has to be canonical, or "+91 98765 43210" and
// "9876543210" become two different accounts.

// Indian mobile numbers are 10 digits starting 6-9. Landlines and the 0-prefixed
// STD format cannot receive an OTP, so they are rejected rather than stored.
const IN_MOBILE = /^[6-9]\d{9}$/;

const COUNTRY_DIAL_CODES = { IN: '91' };

/**
 * Normalise user input to E.164.
 * @returns {{ok: true, e164: string} | {ok: false, reason: string}}
 */
function normalizePhone(input, country = env.DEFAULT_PHONE_COUNTRY) {
  if (typeof input !== 'string') return { ok: false, reason: 'Phone number is required' };

  // Strip everything a human might type: spaces, dashes, brackets, dots.
  let raw = input.trim().replace(/[\s\-().]/g, '');
  if (!raw) return { ok: false, reason: 'Phone number is required' };

  const dial = COUNTRY_DIAL_CODES[country] || COUNTRY_DIAL_CODES.IN;

  // 00 is the international prefix in much of the world; treat it as '+'.
  if (raw.startsWith('00')) raw = `+${raw.slice(2)}`;

  if (raw.startsWith('+')) {
    const digits = raw.slice(1);
    if (!/^\d{8,15}$/.test(digits)) return { ok: false, reason: 'Enter a valid phone number' };
    // Only India is supported for now: an unvalidated foreign number would sail
    // through as "valid" and then silently fail to receive any OTP.
    if (!digits.startsWith(dial)) {
      return { ok: false, reason: 'Only Indian (+91) mobile numbers are supported right now' };
    }
    const national = digits.slice(dial.length);
    if (!IN_MOBILE.test(national)) {
      return { ok: false, reason: 'Enter a valid 10-digit Indian mobile number' };
    }
    return { ok: true, e164: `+${dial}${national}` };
  }

  // Bare national input. Drop a leading 0 (STD prefix) and a bare country code.
  let national = raw;
  if (national.startsWith('0')) national = national.replace(/^0+/, '');
  if (national.length > 10 && national.startsWith(dial)) national = national.slice(dial.length);

  if (!IN_MOBILE.test(national)) {
    return { ok: false, reason: 'Enter a valid 10-digit Indian mobile number' };
  }
  return { ok: true, e164: `+${dial}${national}` };
}

/**
 * "+919876543210" -> "+91 ••••• 43210". Used anywhere we tell an unauthenticated
 * caller which number we texted: enough for the owner to recognise it, useless to
 * anyone who has stolen the password and is fishing for the number.
 */
function maskPhone(e164) {
  if (!e164 || typeof e164 !== 'string') return '';
  const last4 = e164.slice(-4);
  return `${e164.slice(0, 3)} ••••• ${last4}`;
}

module.exports = { normalizePhone, maskPhone };
