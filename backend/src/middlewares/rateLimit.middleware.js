const { cacheIncr, isRedisReady } = require('../infrastructure/cache/redis');
const { recordRateLimit } = require('../infrastructure/observability/securityEvents');
const env = require('../config/env');

/**
 * Redis-backed sliding-window rate limiter middleware.
 * Falls back to allowing requests if Redis is unavailable
 * (the express-rate-limit in-memory limiter is still active as a safety net).
 *
 * @param {object} opts
 * @param {number} opts.windowSeconds - Window duration (default 60)
 * @param {number} opts.max           - Max requests per window (default 100)
 * @param {string} opts.prefix        - Key prefix (default 'rl')
 * @param {function} [opts.keyGenerator] - (req) => string  (default: req.ip)
 */
function redisRateLimit({ windowSeconds = 60, max = 100, prefix = 'rl', keyGenerator } = {}) {
  return async (req, res, next) => {
    if (env.NODE_ENV !== 'production') return next(); // bypass rate-limiting in development
    if (!isRedisReady()) return next(); // fallback: allow

    const identifier = keyGenerator ? keyGenerator(req) : req.ip;
    const key = `${prefix}:${identifier}`;

    const count = await cacheIncr(key, windowSeconds);
    if (count === null) return next(); // Redis hiccup — allow

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count));

    if (count > max) {
      recordRateLimit(req.ip, req.originalUrl, req.get('user-agent') || '').catch(() => {});
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    next();
  };
}

module.exports = { redisRateLimit };
