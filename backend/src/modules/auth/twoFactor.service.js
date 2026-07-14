const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const { ApiError } = require('../../utils/apiError');
const { User } = require('../users/user.model');
const { OtpChallenge } = require('../../models/OtpChallenge');
const { sendOtpSms } = require('../../utils/smsService');
const { normalizePhone, maskPhone } = require('../../utils/phone');
const { logger } = require('../../infrastructure/observability/logger');
const { recordSecurityEvent } = require('../../infrastructure/observability/securityEvents');

// ─── CODES ──────────────────────────────────────────────────────────────

// Uniform over [0, 10^len). Math.random() would be both biased and predictable;
// for a value that guards an account, the CSPRNG is the only acceptable source.
function generateOtpCode(length = env.OTP_LENGTH) {
  const max = 10 ** length;
  const limit = Math.floor(0xffffffff / max) * max; // reject the biased tail
  let n;
  do {
    n = crypto.randomBytes(4).readUInt32BE(0);
  } while (n >= limit);
  return String(n % max).padStart(length, '0');
}

function hashOtp(code) {
  return crypto.createHmac('sha256', env.OTP_PEPPER).update(String(code)).digest('hex');
}

// Timing-safe compare so the number of matching leading characters can't be
// inferred from how long the request takes.
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// ─── PENDING (HALF-AUTHENTICATED) TOKEN ─────────────────────────────────
// Issued once the password is verified but before the OTP is. It is NOT an access
// token: it carries a distinct `typ` and is signed such that it can never be
// mistaken for one, and it grants access to nothing except the OTP endpoints.
const PENDING_TTL_SECONDS = env.OTP_TTL_MINUTES * 60;

function issuePendingToken(userId, challengeId) {
  return jwt.sign(
    { sub: String(userId), cid: String(challengeId), typ: '2fa_pending' },
    env.JWT_ACCESS_SECRET,
    { expiresIn: PENDING_TTL_SECONDS }
  );
}

function verifyPendingToken(token) {
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch {
    throw new ApiError(401, 'Your verification session expired. Please sign in again.');
  }
  // Without this check an ordinary access token would satisfy the 2FA endpoints,
  // letting a half-authenticated session promote itself.
  if (payload.typ !== '2fa_pending') {
    throw new ApiError(401, 'Invalid verification session');
  }
  return payload;
}

// ─── SENDING ────────────────────────────────────────────────────────────

/**
 * Create (or replace) a challenge and text the code.
 *
 * @param {'auto'|'explicit'} intent
 *   'explicit' — the user pressed "Resend". Throttling them with a 429 is the
 *   correct, expected answer.
 *
 *   'auto' — a side effect of some other action they took (signing in, starting
 *   phone verification). Throwing here would be perverse: someone who signs in,
 *   closes the tab, and signs in again 20s later would be told to wait — locked
 *   out of their own account by the anti-spam guard. So when a live code already
 *   exists and we're inside the cooldown, we silently REUSE it. The user still
 *   has that SMS; it is still valid; no second message is sent and nothing is
 *   billed. This is the difference between rate-limiting a *message* and
 *   rate-limiting a *login*.
 */
async function issueChallenge({ user, purpose, phoneE164, intent = 'auto' }) {
  const now = Date.now();

  const existing = await OtpChallenge.findOne({
    userId: user._id,
    purpose,
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  });

  let sendCount = 1;
  if (existing) {
    const since = now - existing.lastSentAt.getTime();
    const withinCooldown = since < env.OTP_RESEND_COOLDOWN_SECONDS * 1000;
    // Cap sends per challenge so this can't be turned into an SMS-pumping faucet
    // (every send costs real money and rings a real handset).
    const capped = existing.sendCount >= env.OTP_MAX_SENDS_PER_HOUR;

    if (intent === 'explicit') {
      if (withinCooldown) {
        const wait = Math.ceil((env.OTP_RESEND_COOLDOWN_SECONDS * 1000 - since) / 1000);
        throw new ApiError(429, `Please wait ${wait}s before requesting another code.`);
      }
      if (capped) throw new ApiError(429, 'Too many codes requested. Please try again later.');
    } else if (withinCooldown || capped) {
      // Reuse the live challenge as-is. The phone may differ only in the
      // phone_verify case, where the user changed the number mid-flow — then we
      // must not reuse a code bound to the old one.
      if (existing.phoneE164 === phoneE164) return existing;
    }

    sendCount = existing.sendCount + 1;
  }

  const code = generateOtpCode();
  const expiresAt = new Date(now + env.OTP_TTL_MINUTES * 60 * 1000);

  // Upsert: one live challenge per (user, purpose). A new code invalidates the
  // old one — two valid codes at once would double an attacker's guessing odds.
  const challenge = await OtpChallenge.findOneAndUpdate(
    { userId: user._id, purpose, consumedAt: null },
    {
      $set: {
        phoneE164,
        codeHash: hashOtp(code),
        expiresAt,
        lastSentAt: new Date(),
        sendCount,
        attempts: 0, // fresh code, fresh attempt budget
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    await sendOtpSms(phoneE164, code, env.OTP_TTL_MINUTES);
  } catch (err) {
    // Never leave a live code behind for an SMS that never went out.
    await OtpChallenge.deleteOne({ _id: challenge._id });
    logger.error('OTP SMS delivery failed', { userId: String(user._id), error: err.message });
    throw new ApiError(502, 'We could not send the code right now. Please try again shortly.');
  }

  return challenge;
}

/**
 * Called by login() once the password checks out. Returns the payload the client
 * needs to complete the second step — and no tokens.
 */
async function beginLoginChallenge(user, req) {
  const challenge = await issueChallenge({
    user,
    purpose: 'login_2fa',
    phoneE164: user.phoneE164,
  });

  recordSecurityEvent('two_factor_challenged', {
    ip: req?.ip,
    userAgent: req?.get?.('user-agent') || '',
    endpoint: req?.originalUrl || '',
    userId: user._id,
    email: user.email,
  }).catch(() => {});

  return {
    twoFactorRequired: true,
    pendingToken: issuePendingToken(user._id, challenge._id),
    // Masked, never the full number: the caller has proven only the password so
    // far, and handing them the victim's phone number would be a free upgrade.
    phoneMasked: maskPhone(user.phoneE164),
    expiresInSeconds: env.OTP_TTL_MINUTES * 60,
  };
}

async function resendLoginCode(pendingToken) {
  const { sub } = verifyPendingToken(pendingToken);
  const user = await User.findById(sub);
  if (!user || !user.isActive || !user.twoFactorEnabled) {
    throw new ApiError(401, 'Invalid verification session');
  }

  const challenge = await issueChallenge({
    user,
    purpose: 'login_2fa',
    phoneE164: user.phoneE164,
    // The user pressed "Resend" — throttle them properly rather than silently
    // handing back the old code they just told us they never received.
    intent: 'explicit',
  });

  // The challenge row is reused, so the original pendingToken stays valid; the
  // client keeps using it and only the code changes.
  return {
    phoneMasked: maskPhone(user.phoneE164),
    expiresInSeconds: env.OTP_TTL_MINUTES * 60,
    challengeId: String(challenge._id),
  };
}

// ─── VERIFYING ──────────────────────────────────────────────────────────

/**
 * Consume a code. Returns the user on success.
 * Wrong codes burn one of a fixed number of attempts; running out destroys the
 * challenge, so an attacker gets OTP_MAX_ATTEMPTS guesses out of a million and
 * then has to start over (and the owner gets a fresh SMS they didn't ask for).
 */
async function consumeCode({ userId, purpose, code }, req) {
  const challenge = await OtpChallenge.findOne({
    userId,
    purpose,
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!challenge) {
    throw new ApiError(400, 'That code has expired. Please request a new one.');
  }

  if (challenge.attempts >= env.OTP_MAX_ATTEMPTS) {
    await OtpChallenge.deleteOne({ _id: challenge._id });
    throw new ApiError(429, 'Too many incorrect attempts. Please request a new code.');
  }

  if (!safeEqual(hashOtp(code), challenge.codeHash)) {
    const updated = await OtpChallenge.findOneAndUpdate(
      { _id: challenge._id, consumedAt: null },
      { $inc: { attempts: 1 } },
      { new: true }
    );

    recordSecurityEvent('two_factor_failed', {
      ip: req?.ip,
      userAgent: req?.get?.('user-agent') || '',
      endpoint: req?.originalUrl || '',
      userId,
      details: { purpose, attempts: updated?.attempts },
    }).catch(() => {});

    const left = Math.max(0, env.OTP_MAX_ATTEMPTS - (updated?.attempts ?? 0));
    if (left === 0) {
      await OtpChallenge.deleteOne({ _id: challenge._id });
      throw new ApiError(429, 'Too many incorrect attempts. Please request a new code.');
    }
    throw new ApiError(400, `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} remaining.`);
  }

  // Atomic consume: whoever flips consumedAt first wins, so the same code can
  // never be redeemed twice by two racing requests.
  const consumed = await OtpChallenge.findOneAndUpdate(
    { _id: challenge._id, consumedAt: null },
    { $set: { consumedAt: new Date() } },
    { new: true }
  );
  if (!consumed) throw new ApiError(400, 'That code has already been used.');

  await OtpChallenge.deleteOne({ _id: challenge._id });
  return true;
}

/**
 * Second step of login: swap a valid pendingToken + code for real tokens.
 * `issueTokens` is injected by auth.service to avoid a circular require.
 */
async function verifyLoginCode({ pendingToken, code }, issueTokens, req) {
  const { sub } = verifyPendingToken(pendingToken);

  const user = await User.findById(sub);
  if (!user || !user.isActive || !user.twoFactorEnabled) {
    throw new ApiError(401, 'Invalid verification session');
  }

  await consumeCode({ userId: user._id, purpose: 'login_2fa', code }, req);

  recordSecurityEvent('two_factor_success', {
    ip: req?.ip,
    userAgent: req?.get?.('user-agent') || '',
    endpoint: req?.originalUrl || '',
    userId: user._id,
    email: user.email,
  }).catch(() => {});

  const tokens = await issueTokens(user);
  return { user, ...tokens };
}

// ─── BACKUP CODES ───────────────────────────────────────────────────────

// Shown to the user exactly once, at enrolment. We store only bcrypt hashes, so
// we genuinely cannot recover them — losing them means re-generating the set.
function generateBackupCodes(count = 10) {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(5).toString('hex').toUpperCase().match(/.{1,5}/g).join('-')
  );
}

async function hashBackupCodes(codes) {
  // rounds=8: these are high-entropy random codes, not human passwords, so the
  // work factor exists to slow an offline attacker, not to survive a dictionary.
  return Promise.all(codes.map(c => bcrypt.hash(c, 8)));
}

/**
 * Sign in with a recovery code when the phone is gone. Each code works once.
 */
async function verifyBackupCode({ pendingToken, backupCode }, issueTokens, req) {
  const { sub } = verifyPendingToken(pendingToken);

  const user = await User.findById(sub).select('+twoFactorBackupCodes');
  if (!user || !user.isActive || !user.twoFactorEnabled) {
    throw new ApiError(401, 'Invalid verification session');
  }

  const supplied = String(backupCode).trim().toUpperCase();
  const hashes = user.twoFactorBackupCodes || [];

  let matchedIndex = -1;
  for (let i = 0; i < hashes.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (await bcrypt.compare(supplied, hashes[i])) {
      matchedIndex = i;
      break;
    }
  }

  if (matchedIndex === -1) {
    recordSecurityEvent('two_factor_failed', {
      ip: req?.ip,
      userAgent: req?.get?.('user-agent') || '',
      endpoint: req?.originalUrl || '',
      userId: user._id,
      details: { method: 'backup_code' },
    }).catch(() => {});
    throw new ApiError(400, 'That recovery code is not valid.');
  }

  // Burn it. $pull on the exact hash is atomic, so two racing requests with the
  // same code cannot both consume it.
  const burned = await User.findOneAndUpdate(
    { _id: user._id, twoFactorBackupCodes: hashes[matchedIndex] },
    { $pull: { twoFactorBackupCodes: hashes[matchedIndex] } },
    // The field is select:false, so it must be asked for explicitly or the
    // returned doc omits it and the remaining count reads as zero.
    { new: true, select: '+twoFactorBackupCodes' }
  );
  if (!burned) throw new ApiError(400, 'That recovery code has already been used.');

  recordSecurityEvent('two_factor_success', {
    ip: req?.ip,
    userAgent: req?.get?.('user-agent') || '',
    endpoint: req?.originalUrl || '',
    userId: user._id,
    email: user.email,
    details: { method: 'backup_code' },
  }).catch(() => {});

  const remaining = (burned.twoFactorBackupCodes || []).length;
  const tokens = await issueTokens(user);
  return { user, remainingBackupCodes: remaining, ...tokens };
}

// ─── PHONE VERIFICATION (authenticated) ─────────────────────────────────

/**
 * Start proving ownership of a number. Used at signup, from the dashboard
 * backfill prompt, and when changing an existing number.
 */
async function startPhoneVerification({ userId, phone }, req) {
  const parsed = normalizePhone(phone);
  if (!parsed.ok) throw new ApiError(400, parsed.reason);

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  // Enforce the same one-number-one-account rule the unique index guarantees,
  // but *before* spending an SMS, so the user gets a clear message instead of a
  // duplicate-key error after the code arrives.
  const taken = await User.findOne({
    _id: { $ne: user._id },
    phoneE164: parsed.e164,
    phoneVerifiedAt: { $ne: null },
  });
  if (taken) {
    throw new ApiError(409, 'That number is already linked to another account.');
  }

  await issueChallenge({ user, purpose: 'phone_verify', phoneE164: parsed.e164 });

  return { phoneMasked: maskPhone(parsed.e164), expiresInSeconds: env.OTP_TTL_MINUTES * 60 };
}

async function confirmPhoneVerification({ userId, code }, req) {
  const challenge = await OtpChallenge.findOne({
    userId,
    purpose: 'phone_verify',
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!challenge) throw new ApiError(400, 'That code has expired. Please request a new one.');

  const phoneE164 = challenge.phoneE164;
  await consumeCode({ userId, purpose: 'phone_verify', code }, req);

  try {
    await User.updateOne(
      { _id: userId },
      { $set: { phoneE164, phoneVerifiedAt: new Date() } }
    );
  } catch (err) {
    // The unique partial index is the last line of defence if someone verified
    // the same number on another account in the seconds since the pre-check.
    if (err.code === 11000) {
      throw new ApiError(409, 'That number is already linked to another account.');
    }
    throw err;
  }

  recordSecurityEvent('phone_verified', {
    ip: req?.ip,
    userAgent: req?.get?.('user-agent') || '',
    endpoint: req?.originalUrl || '',
    userId,
  }).catch(() => {});

  return { phoneMasked: maskPhone(phoneE164) };
}

// ─── ENABLE / DISABLE ───────────────────────────────────────────────────

async function enableTwoFactor({ userId }, req) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  // Turning 2FA on without a verified number would lock the user out of their
  // own account on the very next login.
  if (!user.phoneE164 || !user.phoneVerifiedAt) {
    throw new ApiError(400, 'Verify a mobile number before turning on two-factor authentication.');
  }
  if (user.twoFactorEnabled) throw new ApiError(409, 'Two-factor authentication is already on.');

  const codes = generateBackupCodes();
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        twoFactorEnabled: true,
        twoFactorEnabledAt: new Date(),
        twoFactorBackupCodes: await hashBackupCodes(codes),
      },
    }
  );

  recordSecurityEvent('two_factor_enabled', {
    ip: req?.ip,
    userAgent: req?.get?.('user-agent') || '',
    endpoint: req?.originalUrl || '',
    userId: user._id,
    email: user.email,
  }).catch(() => {});

  // The only time these are ever visible. After this response they exist solely
  // as bcrypt hashes.
  return { backupCodes: codes, phoneMasked: maskPhone(user.phoneE164) };
}

/**
 * Disabling is a downgrade in security, so it costs a password re-auth. Otherwise
 * anyone who grabs an unlocked laptop can strip 2FA off silently.
 */
async function disableTwoFactor({ userId, password }, req) {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) throw new ApiError(404, 'User not found');
  if (!user.twoFactorEnabled) throw new ApiError(409, 'Two-factor authentication is already off.');

  if (!user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'Incorrect password.');
  }

  await User.updateOne(
    { _id: user._id },
    {
      $set: { twoFactorEnabled: false, twoFactorEnabledAt: null, twoFactorBackupCodes: [] },
    }
  );

  recordSecurityEvent('two_factor_disabled', {
    ip: req?.ip,
    userAgent: req?.get?.('user-agent') || '',
    endpoint: req?.originalUrl || '',
    userId: user._id,
    email: user.email,
  }).catch(() => {});

  return true;
}

async function regenerateBackupCodes({ userId, password }) {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) throw new ApiError(404, 'User not found');
  if (!user.twoFactorEnabled) throw new ApiError(400, 'Two-factor authentication is not enabled.');
  if (!user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'Incorrect password.');
  }

  const codes = generateBackupCodes();
  await User.updateOne(
    { _id: user._id },
    { $set: { twoFactorBackupCodes: await hashBackupCodes(codes) } }
  );
  // Regenerating invalidates the previous set — that is the point of the button.
  return { backupCodes: codes };
}

module.exports = {
  beginLoginChallenge,
  resendLoginCode,
  verifyLoginCode,
  verifyBackupCode,
  startPhoneVerification,
  confirmPhoneVerification,
  enableTwoFactor,
  disableTwoFactor,
  regenerateBackupCodes,
  // exported for tests
  generateOtpCode,
  hashOtp,
};
