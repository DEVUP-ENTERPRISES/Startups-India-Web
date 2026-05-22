const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../users/user.model');
const env = require('../../config/env');
const { ApiError } = require('../../utils/apiError');
const { recordFailedLogin, recordInvalidToken } = require('../../infrastructure/observability/securityEvents');

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

async function signup({ email, password, fullName }) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, fullName, provider: 'email' });
  const tokens = await generateAndStoreTokens(user);
  return { user, ...tokens };
}

async function login({ email, password }, req) {
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) {
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

module.exports = {
  signup,
  login,
  loginWithGoogle,
  loginWithFacebook,
  refresh,
  logout,
};
