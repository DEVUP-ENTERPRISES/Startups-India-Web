const { cacheGetOrSet } = require('../infrastructure/cache/redis');

/**
 * Express middleware - stampede-protected response caching.
 *
 * Uses cacheGetOrSet internally:
 *   - On HIT:  returns cached JSON immediately (X-Cache: HIT)
 *   - On MISS: only ONE request hits the controller; others coalesce
 *
 * @param {string|function} keyOrFn  - Static key string OR (req) => string
 * @param {number}          ttl      - TTL in seconds (default 300 = 5 min)
 */
function cacheMiddleware(keyOrFn, ttl = 300) {
  return async (req, res, next) => {
    const cacheKey = typeof keyOrFn === 'function' ? keyOrFn(req) : keyOrFn;
    const start = Date.now();

    // Wrap the downstream handler as a computeFn for stampede protection.
    // We intercept res.json to capture the response body.
    let resolveBody, rejectBody;
    const bodyPromise = new Promise((resolve, reject) => {
      resolveBody = resolve;
      rejectBody = reject;
    });

    const result = await cacheGetOrSet(cacheKey, ttl, () => {
      // Cache miss - run the real handler and capture its output
      return new Promise((resolve, reject) => {
        const originalJson = res.json.bind(res);
        res.json = body => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            resolve(null); // don't cache errors
          }
          res.setHeader('X-Cache', 'MISS');
          res.setHeader('X-Cache-Key', cacheKey);
          res.setHeader('X-Response-Time', `${Date.now() - start}ms`);
          return originalJson(body);
        };

        // If next() throws or the route errors, reject so the lock releases
        const originalEnd = res.end.bind(res);
        res.end = function (...args) {
          resolve(null); // non-JSON response - don't cache
          return originalEnd(...args);
        };

        next();
      });
    });

    // If result came from cache (cacheGetOrSet returned cached data before
    // calling the computeFn), send it directly.
    if (result !== null && !res.headersSent) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Key', cacheKey);
      res.setHeader('X-Response-Time', `${Date.now() - start}ms`);
      return res.json(result);
    }
    // If result is null and headers not sent, the handler never called res.json
    // (shouldn't happen, but safe fallback)
  };
}

module.exports = { cacheMiddleware };
