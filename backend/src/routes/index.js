const { authRouter } = require('../modules/auth/auth.routes');
const { assessmentsRouter } = require('../modules/assessments/assessments.routes');
const { usersRouter } = require('../modules/users/users.routes');
const { coursesRouter } = require('../modules/courses/courses.routes');
const { enrollmentsRouter } = require('../modules/enrollments/enrollments.routes');
const { paymentsRouter } = require('../modules/payments/payments.routes');
const { certificatesRouter } = require('../modules/certificates/certificates.routes');
const { profilesRouter } = require('../modules/profiles/profiles.routes');
const { learningRouter } = require('../modules/learning/learning.routes');
const { learnRouter } = require('../modules/learning/learningEngine.routes');
const { adminRouter } = require('../modules/admin/admin.routes');
const { analyticsRouter } = require('../modules/analytics/analytics.routes');
const { achievementsRouter } = require('../modules/achievements/achievements.routes');
const { communityRouter } = require('../modules/community/community.routes');
const { settingsRouter } = require('../modules/settings/settings.routes');
const { mediaRouter } = require('../modules/media/media.routes');
const { eventsRouter } = require('../modules/events/events.routes');
const articleRouter = require('../modules/public/article.routes');
const { publicRouter } = require('../modules/public/public.routes');
const { asyncHandler } = require('../utils/asyncHandler');
const { authRequired } = require('../middlewares/authMiddleware');
const { getActivities } = require('../utils/activityLogger');

function registerRoutes(app) {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/courses', coursesRouter);
  app.use('/api/v1/enrollments', enrollmentsRouter);
  app.use('/api/v1/payments', paymentsRouter);
  app.use('/api/v1/certificates', certificatesRouter);
  app.use('/api/v1/profiles', profilesRouter);
  app.use('/api/v1/learning', learningRouter);
  app.use('/api/v1/learn', learnRouter);
  app.use('/api/v1/assessments', assessmentsRouter);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/analytics', analyticsRouter);
  app.use('/api/v1/achievements', achievementsRouter);
  app.use('/api/v1/community', communityRouter);
  app.use('/api/v1/settings', settingsRouter);
  app.use('/api/v1/media', mediaRouter);
  app.use('/api/v1/events', eventsRouter);
  app.use('/api/v1/articles', articleRouter);
  app.use('/api/v1/public', publicRouter);

  // Public upload URL endpoint (alias to media/upload-url)
  const mediaController = require('../modules/media/media.controller');
  const { requireRole } = require('../middlewares/authMiddleware');
  app.post(
    '/api/v1/upload-url',
    authRequired,
    requireRole('admin', 'instructor'),
    asyncHandler(mediaController.getUploadUrl)
  );
  app.post(
    '/api/v1/upload-complete',
    authRequired,
    requireRole('admin', 'instructor'),
    asyncHandler(mediaController.completeUpload)
  );

  // Activity feed
  app.get(
    '/api/v1/activity',
    authRequired,
    asyncHandler(async (req, res) => {
      const activities = await getActivities(req.user.userId, Number(req.query.limit) || 20);
      res.json({ success: true, data: activities });
    })
  );
}

module.exports = { registerRoutes };
