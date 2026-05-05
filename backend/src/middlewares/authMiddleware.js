const env = require('../config/env');
const { ApiError } = require('../utils/apiError');
const { verifyAccessToken } = require('../utils/token');

function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const cookieToken = req.cookies?.accessToken;
    const token = bearerToken || cookieToken;

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const payload = verifyAccessToken(token, env);
    req.user = {
      userId: payload.sub,
      role: payload.role || 'user',
      email: payload.email,
    };
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}

function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const cookieToken = req.cookies?.accessToken;
    const token = bearerToken || cookieToken;

    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token, env);
    req.user = {
      userId: payload.sub,
      role: payload.role || 'user',
      email: payload.email,
    };
    return next();
  } catch (error) {
    return next();
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }
    return next();
  };
}

module.exports = { authRequired, requireRole, optionalAuth };
