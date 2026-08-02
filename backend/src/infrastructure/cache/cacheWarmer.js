const { isRedisReady, cacheSet } = require('./redis');
const { logger } = require('../observability/logger');

/**
 * Pre-warm critical cache keys on server startup.
 * Failure here is non-fatal - the app will just serve cold on first request.
 */
async function warmCache() {
  if (!isRedisReady()) {
    logger.info('cache:warm - skipped (Redis unavailable)');
    return;
  }

  const start = Date.now();
  const results = { warmed: [], failed: [] };

  // ── Published courses list ────────────────────────────────────
  try {
    const { listCourses } = require('../../modules/courses/courses.service');
    const courses = await listCourses();
    await cacheSet('courses:all', courses, 300);
    results.warmed.push('courses:all');
  } catch (err) {
    results.failed.push({ key: 'courses:all', error: err.message });
  }

  // ── Admin dashboard analytics ─────────────────────────────────
  try {
    const { getDashboardAnalytics } = require('../../modules/admin/admin.service');
    const analytics = await getDashboardAnalytics();
    await cacheSet('dashboard:stats', analytics, 60);
    results.warmed.push('dashboard:stats');
  } catch (err) {
    results.failed.push({ key: 'dashboard:stats', error: err.message });
  }

  const elapsed = Date.now() - start;
  logger.info('cache:warm - complete', {
    warmed: results.warmed,
    failed: results.failed,
    ms: elapsed,
  });
}

module.exports = { warmCache };
