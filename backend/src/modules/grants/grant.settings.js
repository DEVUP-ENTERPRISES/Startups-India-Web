const { Settings } = require('../../models/Settings');
const { ApiError } = require('../../utils/apiError');
const { cacheGet, cacheSet, cacheDel } = require('../../infrastructure/cache/redis');

/**
 * Single source of truth for every tunable in the Startup Grant workflow.
 *
 * Nothing in the grant business logic may read a literal fee, deadline, file
 * limit or label — it all comes through here. The values below are DEFAULTS used
 * only when an admin has never set the key; the moment a row exists in Settings,
 * it wins. That is what makes "change the fee from ₹999 to ₹499 without a code
 * change" actually true rather than aspirational.
 *
 * Stored in the existing key/value Settings collection under category 'grant',
 * so the admin settings UI and audit trail come for free.
 */

const CACHE_KEY = 'grant:settings';
const CACHE_TTL_SECONDS = 60;

// type is used to coerce + validate whatever the admin submits.
const SCHEMA = {
  // ─── Feature switches ───────────────────────────────────────────────
  'grant.applications.enabled': { type: 'boolean', default: true },
  'grant.evaluation.enabled': { type: 'boolean', default: true },
  // When false, a submitted application is locked. Admin flips this (globally)
  // or grants a per-application revision to let a student edit again.
  'grant.revisions.enabled': { type: 'boolean', default: false },

  // ─── Money. Fee is in MINOR units (paise) to avoid float drift. ─────
  // Idea Evaluation fee — ₹1499 (149900 paise). Admin-editable.
  'grant.evaluation.fee': { type: 'integer', default: 149900, min: 0 },
  'grant.evaluation.currency': { type: 'string', default: 'INR' },
  // Percent, e.g. 18 = 18% GST. Applied on top of the fee.
  'grant.evaluation.gstPercent': { type: 'number', default: 18, min: 0, max: 100 },
  // Idea Evaluation is scored out of 100; this many marks is the pass line.
  // >= threshold advances to the next phases; below it is not selected.
  'grant.evaluation.passThreshold': { type: 'integer', default: 50, min: 0, max: 100 },

  // ─── Later-phase pricing (Phases 3 & 4). ────────────────────────────
  // Admin-set ahead of launch. 0 = price not published yet (the journey shows
  // "Coming soon" rather than a rupee figure until it's above 0). In paise.
  'grant.preIncubation.fee': { type: 'integer', default: 0, min: 0 },
  'grant.incubation.fee': { type: 'integer', default: 0, min: 0 },

  // ─── Capacity + deadline ────────────────────────────────────────────
  // 0 = unlimited. Guards the intake from being swamped.
  'grant.applications.max': { type: 'integer', default: 0, min: 0 },
  // ISO date string, or '' for no deadline.
  'grant.applications.deadline': { type: 'string', default: '' },
  // One application per user unless an admin raises this.
  'grant.applications.maxPerUser': { type: 'integer', default: 1, min: 1 },

  // ─── Uploads ────────────────────────────────────────────────────────
  'grant.upload.maxSizeMb': { type: 'integer', default: 25, min: 1, max: 200 },
  'grant.upload.pitchDeckTypes': {
    type: 'stringArray',
    default: ['application/pdf', 'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  },
  'grant.upload.documentTypes': {
    type: 'stringArray',
    default: ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  'grant.upload.imageTypes': {
    type: 'stringArray',
    default: ['image/jpeg', 'image/png', 'image/webp'],
  },
  'grant.upload.videoTypes': {
    type: 'stringArray',
    default: ['video/mp4', 'video/quicktime', 'video/webm'],
  },

  // ─── Copy / labels (admin-editable, no redeploy) ────────────────────
  // User-facing wording says "Funding", not "Grant" — the internal keys stay
  // `grant.*` so no data or route has to move.
  'grant.ui.sidebarLabel': { type: 'string', default: 'Apply for Startup Funding' },
  'grant.ui.title': { type: 'string', default: 'Startup Funding Application' },
  'grant.ui.description': {
    type: 'string',
    default: 'Apply for funding, mentorship and incubation support for your startup.',
  },
  'grant.ui.termsText': {
    type: 'string',
    default: 'I confirm the information provided is accurate and complete.',
  },

  // ─── Taxonomy. Admin-editable so new categories/stages need no deploy. ──
  'grant.stages': {
    type: 'stringArray',
    default: ['Idea', 'Prototype', 'MVP', 'Revenue', 'Scaling'],
  },
  'grant.categories': {
    type: 'stringArray',
    default: ['FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'SaaS', 'D2C',
      'DeepTech', 'CleanTech', 'AI/ML', 'Other'],
  },

  // ─── Evaluation scoring. Criteria drive the reviewer form dynamically. ──
  'grant.evaluation.criteria': {
    type: 'stringArray',
    default: ['Innovation', 'Market Size', 'Execution', 'Technology',
      'Business Model', 'Presentation', 'Scalability'],
  },
  'grant.evaluation.maxScore': { type: 'integer', default: 10, min: 1, max: 100 },
};

function coerce(key, raw) {
  const spec = SCHEMA[key];
  if (!spec) throw new ApiError(400, `Unknown grant setting: ${key}`);

  let value = raw;

  switch (spec.type) {
    case 'boolean':
      if (typeof value === 'string') value = value === 'true';
      if (typeof value !== 'boolean') throw new ApiError(400, `${key} must be true or false`);
      break;

    case 'integer':
    case 'number': {
      const n = Number(value);
      if (!Number.isFinite(n)) throw new ApiError(400, `${key} must be a number`);
      if (spec.type === 'integer' && !Number.isInteger(n)) {
        throw new ApiError(400, `${key} must be a whole number`);
      }
      if (spec.min !== undefined && n < spec.min) {
        throw new ApiError(400, `${key} must be at least ${spec.min}`);
      }
      if (spec.max !== undefined && n > spec.max) {
        throw new ApiError(400, `${key} must be at most ${spec.max}`);
      }
      value = n;
      break;
    }

    case 'stringArray':
      if (!Array.isArray(value) || value.some(v => typeof v !== 'string')) {
        throw new ApiError(400, `${key} must be a list of strings`);
      }
      value = value.map(v => v.trim()).filter(Boolean);
      if (value.length === 0) throw new ApiError(400, `${key} cannot be empty`);
      break;

    case 'string':
      if (typeof value !== 'string') throw new ApiError(400, `${key} must be text`);
      value = value.trim();
      break;

    default:
      throw new ApiError(500, `Bad setting spec for ${key}`);
  }

  return value;
}

/**
 * Every grant setting, defaults merged with admin overrides.
 * Cached briefly — this is read on nearly every grant request, and the settings
 * change perhaps twice a year.
 */
async function getGrantSettings() {
  const cached = await cacheGet(CACHE_KEY);
  if (cached) return cached;

  const rows = await Settings.find({ category: 'grant' }).lean();
  const overrides = Object.fromEntries(rows.map(r => [r.key, r.value]));

  const resolved = {};
  for (const [key, spec] of Object.entries(SCHEMA)) {
    resolved[key] = key in overrides ? overrides[key] : spec.default;
  }

  await cacheSet(CACHE_KEY, resolved, CACHE_TTL_SECONDS);
  return resolved;
}

async function getGrantSetting(key) {
  const all = await getGrantSettings();
  if (!(key in all)) throw new ApiError(400, `Unknown grant setting: ${key}`);
  return all[key];
}

/**
 * Admin write. Validates and coerces before persisting so a typo can't put the
 * fee into a state that breaks checkout for everyone.
 */
async function updateGrantSettings(patch, adminUserId) {
  const entries = Object.entries(patch);
  if (entries.length === 0) throw new ApiError(400, 'No settings provided');

  const validated = entries.map(([key, raw]) => ({ key, value: coerce(key, raw) }));

  await Promise.all(
    validated.map(({ key, value }) =>
      Settings.findOneAndUpdate(
        { key },
        { value, category: 'grant', updatedBy: adminUserId },
        { upsert: true, new: true }
      )
    )
  );

  await cacheDel(CACHE_KEY);
  return getGrantSettings();
}

/**
 * Fee breakdown, computed from settings — never from a literal.
 * All amounts in minor units (paise) so there is no floating-point money.
 */
async function computeEvaluationFee() {
  const s = await getGrantSettings();
  const base = s['grant.evaluation.fee'];
  const gstPercent = s['grant.evaluation.gstPercent'];
  const gst = Math.round((base * gstPercent) / 100);

  return {
    currency: s['grant.evaluation.currency'],
    baseAmount: base,
    gstPercent,
    gstAmount: gst,
    totalAmount: base + gst,
  };
}

module.exports = {
  SCHEMA,
  getGrantSettings,
  getGrantSetting,
  updateGrantSettings,
  computeEvaluationFee,
  GRANT_SETTINGS_CACHE_KEY: CACHE_KEY,
};
