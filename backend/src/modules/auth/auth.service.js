const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../users/user.model');
const { MentorApplication } = require('../../models/MentorApplication');
const { InvestorApplication } = require('../../models/InvestorApplication');
const env = require('../../config/env');
const { ApiError } = require('../../utils/apiError');
const { logger } = require('../../infrastructure/observability/logger');
const { normalizePhone } = require('../../utils/phone');
const { sendTransactionalEmail, sendEmail } = require('../../utils/emailService');
const {
  getPasswordResetTemplate,
  getOAuthOnlyResetTemplate,
  getPasswordChangedTemplate,
  getWelcomeEmailTemplate,
} = require('../../utils/emailTemplates');
const {
  recordFailedLogin,
  recordInvalidToken,
  recordSecurityEvent,
} = require('../../infrastructure/observability/securityEvents');

// Generates access + refresh tokens and persists a bcrypt hash of the
// refresh token so it can be validated and rotated on the next /refresh call.
async function generateAndStoreTokens(user) {
  const accessToken = jwt.sign(
    { sub: user._id, role: user.role, email: user.email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign({ sub: user._id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

  // Store hashed refresh token — rounds=8 is fast (~10ms) and sufficient
  const refreshTokenHash = await bcrypt.hash(refreshToken, 8);
  await User.updateOne({ _id: user._id }, { $set: { refreshTokenHash } });

  return { accessToken, refreshToken };
}

async function signup({ email, password, fullName, phone }) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  // The number is captured here but stored UNVERIFIED — phoneVerifiedAt stays
  // null until an OTP is actually echoed back. Nothing security-relevant trusts
  // it before that, which is the whole difference from the legacy `phone` field.
  let phoneE164 = null;
  if (phone) {
    const parsed = normalizePhone(phone);
    if (!parsed.ok) throw new ApiError(400, parsed.reason);
    phoneE164 = parsed.e164;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    passwordHash,
    fullName,
    provider: 'email',
    phoneE164,
  });

  // Send Welcome Email
  try {
    const welcomeTpl = getWelcomeEmailTemplate(fullName);
    await sendEmail({
      to: email,
      subject: welcomeTpl.subject,
      html: welcomeTpl.html,
      text: welcomeTpl.text,
    });
  } catch (emailErr) {
    logger.error('Failed to send welcome email during signup:', emailErr);
  }

  const tokens = await generateAndStoreTokens(user);
  return { user, ...tokens };
}

/**
 * A mentor's User account is only created when an admin approves them, so an
 * applicant who signs up and immediately tries to log in would otherwise be told
 * "Invalid credentials" — baffling, since they just set a password.
 *
 * This explains the real state, but ONLY to someone who supplies the password
 * from their own application. Answering on email alone would let anyone
 * enumerate which addresses have applied to be mentors.
 */
async function explainPendingMentor(email, password) {
  const application = await MentorApplication.findOne({ email: String(email).toLowerCase() })
    .sort({ createdAt: -1 })
    .lean();
  if (!application?.password) return null;

  const isTheirs = await bcrypt.compare(password, application.password);
  if (!isTheirs) return null;

  if (application.status === 'pending') {
    return new ApiError(
      403,
      'Your mentor application is still under review. You will receive an email once it is approved.'
    );
  }
  if (application.status === 'rejected') {
    return new ApiError(403, 'Your mentor application was not approved on this occasion.');
  }
  return null;
}

// Same idea for investor applicants — no login account exists until approval, so
// explain the state, but only when the password matches their application.
async function explainPendingInvestor(email, password) {
  const application = await InvestorApplication.findOne({ email: String(email).toLowerCase() })
    .sort({ createdAt: -1 })
    .lean();
  if (!application?.password) return null;

  const isTheirs = await bcrypt.compare(password, application.password);
  if (!isTheirs) return null;

  if (application.status === 'pending') {
    return new ApiError(
      403,
      'Your investor application is still under review. You will receive an email once it is approved.'
    );
  }
  if (application.status === 'rejected') {
    return new ApiError(403, 'Your investor application was not approved on this occasion.');
  }
  return null;
}

async function login({ email, password }, req) {
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) {
    // Before the generic failure: is this a mentor whose application hasn't been
    // approved yet? Only answers if the password proves it's their application.
    const pending = (await explainPendingMentor(email, password))
      || (await explainPendingInvestor(email, password));
    if (pending) throw pending;

    // Record security event — use best-effort, don't fail the auth flow
    recordFailedLogin(
      req?.ip || 'unknown',
      email,
      req?.get?.('user-agent') || '',
      '/api/v1/auth/login'
    ).catch(() => {});
    throw new ApiError(401, 'Invalid credentials');
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    recordFailedLogin(
      req?.ip || 'unknown',
      email,
      req?.get?.('user-agent') || '',
      '/api/v1/auth/login'
    ).catch(() => {});
    throw new ApiError(401, 'Invalid credentials');
  }
  if (!user.isActive) throw new ApiError(403, 'Account suspended');

  // Second factor. The password was correct, but for a 2FA account that only
  // earns a short-lived pending token — no access/refresh token is minted here,
  // so a stolen password alone buys nothing.
  //
  // Gated by the global TWO_FACTOR_ENABLED switch: while 2FA is paused, even an
  // account with twoFactorEnabled=true logs in with just the password. Without
  // this gate, pausing would strand every 2FA user behind an SMS that isn't sent.
  if (env.TWO_FACTOR_ENABLED && user.twoFactorEnabled && user.phoneE164 && user.phoneVerifiedAt) {
    // Lazily required: twoFactor.service needs generateAndStoreTokens from this
    // module, so a top-level require would be circular.
    const twoFactorService = require('./twoFactor.service');
    return twoFactorService.beginLoginChallenge(user, req);
  }

  const tokens = await generateAndStoreTokens(user);
  return { user, ...tokens };
}

async function loginWithGoogle({ idToken }, envConfig) {
  const client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID);

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: envConfig.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    throw new ApiError(401, 'Invalid Google token');
  }

  const { email, name, picture, sub: googleId } = payload;
  if (!email) throw new ApiError(400, 'Google account does not have an email');

  let user = await User.findOne({
    $or: [{ email }, { 'providerIds.google': googleId }],
  });

  if (!user) {
    user = await User.create({
      email,
      fullName: name || email.split('@')[0],
      avatarUrl: picture || null,
      provider: 'google',
      providerIds: { google: googleId },
      authProviders: ['google'],
    });

    // Send Welcome Email for new Google user
    try {
      const welcomeTpl = getWelcomeEmailTemplate(user.fullName);
      await sendEmail({
        to: email,
        subject: welcomeTpl.subject,
        html: welcomeTpl.html,
        text: welcomeTpl.text,
      });
    } catch (emailErr) {
      logger.error('Failed to send welcome email during Google signup:', emailErr);
    }
  } else {
    if (!user.providerIds?.google) {
      user.providerIds = { ...(user.providerIds || {}), google: googleId };
      if (!user.authProviders.includes('google')) {
        user.authProviders.push('google');
      }
    }
    if (!user.avatarUrl && picture) {
      user.avatarUrl = picture;
    }
    await user.save();
  }

  const tokens = await generateAndStoreTokens(user);
  return { user, ...tokens };
}

async function loginWithFacebook() {
  throw new ApiError(501, 'Facebook login not implemented');
}

async function refresh(token, envConfig) {
  if (!token) throw new ApiError(401, 'Refresh token required');

  let payload;
  try {
    payload = jwt.verify(token, envConfig.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw new ApiError(401, 'User not found');

  // Validate stored hash — prevents replay of stolen/old refresh tokens
  if (!user.refreshTokenHash) {
    throw new ApiError(401, 'Session invalidated. Please log in again.');
  }
  const isValid = await bcrypt.compare(token, user.refreshTokenHash);
  if (!isValid) {
    throw new ApiError(401, 'Session expired or already rotated. Please log in again.');
  }

  // Rotate: issue brand-new tokens (old hash overwritten)
  const tokens = await generateAndStoreTokens(user);
  return { user, ...tokens };
}

async function logout(userId) {
  // Invalidate refresh token so it can never be reused
  await User.updateOne({ _id: userId }, { $set: { refreshTokenHash: null } });
  return true;
}

// ─── PASSWORD RESET ─────────────────────────────────────────────────────
// The reset token is a 256-bit random value. Only its SHA-256 digest is stored,
// so a database leak yields no usable reset links. SHA-256 (not bcrypt) is the
// right primitive here: the token already has full entropy, so there is nothing
// for an attacker to brute-force and no need for a slow KDF.
const RESET_TOKEN_BYTES = 32;

function hashResetToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

function clientMeta(req) {
  return {
    ip: req?.ip || 'unknown',
    userAgent: req?.get?.('user-agent') || '',
    endpoint: req?.originalUrl || '',
  };
}

/**
 * Issue a password-reset email.
 *
 * Always resolves the same way regardless of whether the address is registered —
 * the caller returns one fixed response, so this endpoint cannot be used to
 * enumerate accounts. Every early return below is deliberate silence, not an error.
 */
async function forgotPassword({ email }, req) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const meta = clientMeta(req);

  const user = await User.findOne({ email: normalizedEmail }).select(
    '+resetPasswordTokenHash +resetPasswordExpiresAt +resetPasswordSentAt'
  );

  recordSecurityEvent('password_reset_requested', {
    ...meta,
    email: normalizedEmail,
    userId: user?._id,
    details: { accountExists: Boolean(user) },
  }).catch(() => {});

  // No account, or a suspended one. Say nothing.
  if (!user || !user.isActive) return;

  // OAuth-only account: there is no password to reset. Mail the real owner an
  // explanation instead of a reset link — a stranger probing the endpoint still
  // sees the identical API response and receives nothing.
  if (!user.passwordHash) {
    const provider = user.providerIds?.google ? 'google' : user.provider;
    const tpl = getOAuthOnlyResetTemplate(user.fullName, provider, `${env.FRONTEND_URL}/login`);
    sendEmail({ to: user.email, subject: tpl.subject, html: tpl.html, text: tpl.text }).catch(
      () => {}
    );
    return;
  }

  // Resend cooldown — stops this endpoint being used to flood someone's inbox.
  // The previous link stays valid, so the user is never stranded.
  const sentAt = user.resetPasswordSentAt?.getTime();
  if (sentAt && Date.now() - sentAt < env.PASSWORD_RESET_COOLDOWN_SECONDS * 1000) {
    logger.warn('Password reset re-requested within cooldown; skipping resend', {
      userId: String(user._id),
    });
    return;
  }

  const rawToken = crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex');
  const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_TTL_MINUTES * 60 * 1000);

  // Issuing a new token invalidates any previous one — only the newest link works.
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        resetPasswordTokenHash: hashResetToken(rawToken),
        resetPasswordExpiresAt: expiresAt,
        resetPasswordSentAt: new Date(),
      },
    }
  );

  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;
  const tpl = getPasswordResetTemplate(
    user.fullName,
    resetLink,
    env.PASSWORD_RESET_TTL_MINUTES
  );

  try {
    await sendTransactionalEmail({
      to: user.email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
  } catch (err) {
    // The mail never left, so the token is dead weight — revoke it rather than
    // leaving a live credential lying in the database.
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordTokenHash: null,
          resetPasswordExpiresAt: null,
          resetPasswordSentAt: null,
        },
      }
    );
    // Still no error to the client: a 500 here (versus a 200 for an unknown
    // address) would re-introduce the enumeration oracle we just closed. Ops
    // finds this in the logs and the security feed instead.
    logger.error('Failed to send password reset email', {
      userId: String(user._id),
      error: err.message,
    });
    recordSecurityEvent('password_reset_failed', {
      ...meta,
      email: user.email,
      userId: user._id,
      details: { reason: 'email_delivery_failed', error: err.message },
    }).catch(() => {});
  }
}

/**
 * Consume a reset token and set a new password.
 * Throws 400 for anything unusable — expired, already spent, or unknown.
 */
async function resetPassword({ token, password }, req) {
  const meta = clientMeta(req);
  const tokenHash = hashResetToken(String(token));

  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() },
  }).select('+passwordHash +resetPasswordTokenHash +resetPasswordExpiresAt');

  if (!user) {
    recordSecurityEvent('password_reset_failed', {
      ...meta,
      details: { reason: 'invalid_or_expired_token' },
    }).catch(() => {});
    throw new ApiError(400, 'This reset link is invalid or has expired. Please request a new one.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account suspended');
  }

  // Reusing the current password would silently no-op a reset the user believes
  // succeeded — and if the token leaked, it leaves the old secret in place.
  if (user.passwordHash && (await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(400, 'Your new password must be different from your current password.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const changedAt = new Date();

  // Re-match the token inside the write so it is consumed atomically. If two
  // requests race on the same link, exactly one update matches and the other
  // gets null — the token is genuinely single-use, not just usually so.
  const consumed = await User.findOneAndUpdate(
    {
      _id: user._id,
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { $gt: new Date() },
    },
    {
      $set: {
        passwordHash,
        passwordChangedAt: changedAt,
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
        resetPasswordSentAt: null,
        // Kill every existing session: a reset is how a user evicts an intruder.
        refreshTokenHash: null,
      },
    },
    { new: true }
  );

  if (!consumed) {
    recordSecurityEvent('password_reset_failed', {
      ...meta,
      userId: user._id,
      details: { reason: 'token_already_consumed' },
    }).catch(() => {});
    throw new ApiError(400, 'This reset link is invalid or has expired. Please request a new one.');
  }

  recordSecurityEvent('password_reset_completed', {
    ...meta,
    email: consumed.email,
    userId: consumed._id,
  }).catch(() => {});

  // Tripwire email — best-effort. The password is already changed; a mail outage
  // must not turn a successful reset into an error the user cannot act on.
  const tpl = getPasswordChangedTemplate(
    consumed.fullName,
    changedAt.toUTCString(),
    `${env.FRONTEND_URL}/login`
  );
  sendEmail({
    to: consumed.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  }).catch(() => {});

  // Deliberately no auto-login: the user re-authenticates with the new password,
  // which also proves the change landed.
  return true;
}

module.exports = {
  signup,
  login,
  loginWithGoogle,
  loginWithFacebook,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  // Handed to twoFactor.service so it can mint tokens once the OTP checks out,
  // without requiring this module back (circular).
  generateAndStoreTokens,
};
