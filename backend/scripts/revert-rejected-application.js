/**
 * Recover an application that was wrongly REJECTED by the old scoring logic
 * (any score < 50 rejected). Re-runs the (now corrected) scoring so a nonzero
 * score advances to Pre-Incubation, re-stamps the evaluation, adds a timeline
 * entry, and re-sends the "idea evaluated - book your slot" email/notification.
 *
 * Usage:
 *   node scripts/revert-rejected-application.js <APPLICATION_REF> [score]
 * Example:
 *   node scripts/revert-rejected-application.js GRANT-2026-000028 42
 *
 * If [score] is omitted, the existing evaluation score is reused.
 */
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch { /* ignore */ }

const mongoose = require('mongoose');
const env = require('../src/config/env');
const { GrantApplication, IdeaEvaluation } = require('../src/modules/grants/grant.models');
const evaluationService = require('../src/modules/grants/grant.evaluation.service');

(async () => {
  const ref = process.argv[2];
  const scoreArg = process.argv[3];

  if (!ref) {
    console.error('Provide the application ref, e.g. node scripts/revert-rejected-application.js GRANT-2026-000028 42');
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });

    const app = await GrantApplication.findOne({ applicationId: ref });
    if (!app) {
      console.error(`No application found with ref ${ref}`);
      process.exitCode = 1;
      return;
    }

    const evaluation = await IdeaEvaluation.findOne({ applicationId: app._id }).lean();
    const score = scoreArg != null ? Number(scoreArg) : evaluation?.score;

    if (!Number.isFinite(score)) {
      console.error('No score available. Pass one explicitly, e.g. "... GRANT-2026-000028 42".');
      process.exitCode = 1;
      return;
    }

    console.log(`Before: ${ref} status=${app.status} score=${evaluation?.score ?? 'n/a'}`);

    await evaluationService.scoreApplication({
      applicationDbId: app._id,
      score,
      feedback: evaluation?.feedback || '',
      reviewerId: app.lastActionBy || app.reviewerId || null,
    });

    const after = await GrantApplication.findById(app._id).lean();
    console.log(`After:  ${ref} status=${after.status} score=${score}`);
    console.log('Done. The applicant has been notified to book their 1:1 slot.');
  } catch (err) {
    console.error('Failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
