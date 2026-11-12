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
      role: payload.role ?? null,   // preserve null - don't default to 'user' before onboarding
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
      role: payload.role ?? null,   // preserve null - don't default to 'user' before onboarding
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
    if (req.user.role !== 'admin') return next();

    // Admin claims are re-checked so a demoted or deactivated admin loses access before the token expires.
    const { User } = require('../modules/users/user.model');
    return User.findById(req.user.userId)
      .select('role isActive')
      .lean()
      .then(user => {
        if (!user || user.role !== 'admin' || user.isActive === false) {
          return next(new ApiError(403, 'Insufficient permissions'));
        }
        return next();
      })
      .catch(next);
  };
}

module.exports = { authRequired, requireRole, optionalAuth };
