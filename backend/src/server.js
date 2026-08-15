const dns = require('dns');

// Force reliable DNS (Google + Cloudflare) to resolve MongoDB Atlas and Redis
// hosts: ISP DNS may refuse the SRV lookups that mongodb+srv:// needs, which
// surfaces as an EREFUSED failure at boot.
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const env = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/db');
const { app } = require('./app');
const { logger } = require('./infrastructure/observability/logger');
const { seedAdmin } = require('./utils/seedAdmin');
const { connectRedis, disconnectRedis } = require('./infrastructure/cache/redis');
const { warmCache } = require('./infrastructure/cache/cacheWarmer');
const { jobQueue } = require('./infrastructure/jobs/jobQueue');
const { reconcileOrphanedPayments } = require('./modules/enrollments/enrollments.service');

const isPM2 = !!process.env.PM2_HOME || !!process.env.pm_id;
let server = null;

async function bootstrap() {
  const workerId = process.env.pm_id || process.pid;

  logger.info('Backend bootstrap started', {
    environment: env.NODE_ENV,
    port: env.PORT,
    worker: workerId,
    pid: process.pid,
  });

  await connectDatabase(env.MONGODB_URI);
  await connectRedis();
  await seedAdmin();
  await warmCache();
  await reconcileOrphanedPayments();

  // Slot reminder: every 5 minutes, check for booked slots that are ~2hrs away
  // and send an FCM push to the user that their evaluation report is ready.
  const { SlotDay } = require('./modules/grants/grant.slot.model');
  const { sendToUser } = require('./modules/push/push.service');
  const { IdeaEvaluation } = require('./modules/grants/grant.models');
  const notifiedSlots = new Set(); // in-process dedup (survives across poll cycles)

  setInterval(async () => {
    try {
      const now = new Date();
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      const windowStart = new Date(now.getTime() + 1.9 * 60 * 60 * 1000); // 5-min window

      // Find SlotDay docs that have a booked slot whose scheduled time is in [now+1h55m, now+2h]
      // We use the IdeaEvaluation collection's meeting.scheduledAt since that's canonical
      const upcoming = await IdeaEvaluation.find({
        'meeting.scheduledAt': { $gte: windowStart, $lte: twoHoursLater },
        'score': { $ne: null }, // admin has scored
        'submittedAt': { $ne: null },
      }).populate({ path: 'applicationId', select: 'userId applicationId' }).lean();

      for (const ev of upcoming) {
        const key = String(ev._id);
        if (notifiedSlots.has(key)) continue;

        const userId = ev.applicationId?.userId;
        if (!userId) continue;

        notifiedSlots.add(key);

        await sendToUser(userId, {
          title: '📋 Your Evaluation Report is Ready!',
          body: `Your 1:1 session is in 2 hours. Your evaluation report is now available. Check your dashboard!`,
          data: {
            type: 'report_ready',
            applicationId: String(ev.applicationId?._id || ''),
            clickUrl: '/dashboard/journey/idea-validation',
          },
        }).catch(() => {});

        logger.info('2hr slot reminder FCM sent', { userId: String(userId), evalId: key });
      }
    } catch (err) {
      logger.warn('Slot reminder poll error', { message: err.message });
    }
  }, 5 * 60 * 1000); // every 5 minutes

  // CRM: seed the ready-to-send templates (idempotent) and start the drain
  // worker (resumes any campaign left 'sending' by a restart; enforces the cap).
  await require('./modules/crm/crm.templates.seed').seedDefaultTemplates().catch(() => {});
  await require('./modules/crm/crm.campaign.service').startWorker();

  server = app.listen(env.PORT, '0.0.0.0', () => {
    logger.info('Backend listening', {
      port: env.PORT,
      worker: workerId,
      health: `http://localhost:${env.PORT}/health`,
    });

    // Tell PM2 this process is ready to receive traffic
    if (isPM2 && typeof process.send === 'function') {
      process.send('ready');
    }
  });

  // Keep-alive and header timeouts (must exceed Nginx proxy_read_timeout)
  server.keepAliveTimeout = 65000; // 65s (Nginx default keepalive is 60s)
  server.headersTimeout = 66000;
}

// ─── GRACEFUL SHUTDOWN ────────────────────────────────────────
async function gracefulShutdown(signal) {
  logger.info(`${signal} received - graceful shutdown starting`, { pid: process.pid });

  // 1. Stop accepting new connections
  if (server) {
    await new Promise(resolve => server.close(resolve));
    logger.info('HTTP server closed - no more new connections');
  }

  // 2. Drain in-flight background jobs
  if (jobQueue.pendingCount > 0) {
    logger.info('Draining job queue', { pending: jobQueue.pendingCount });
    await jobQueue.drain(10000);
    logger.info('Job queue drained');
  }

  // 3. Close Redis
  await disconnectRedis();

  // 3. Close MongoDB
  await disconnectDatabase();

  logger.info('Graceful shutdown complete');
  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// PM2 sends this message for graceful reload
process.on('message', msg => {
  if (msg === 'shutdown') {
    gracefulShutdown('PM2_SHUTDOWN');
  }
});

bootstrap().catch(error => {
  logger.error('Failed to start backend', error);
  process.exit(1);
});
