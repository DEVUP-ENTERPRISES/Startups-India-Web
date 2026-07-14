const { SecurityEvent } = require('../../models/SecurityEvent');

// ─── IN-MEMORY RING BUFFER ─────────────────────────────────────────────
// Fast access for the live security feed; DB is the persistent store.
const MAX_IN_MEMORY = 200;
let recentEvents = [];

// Brute-force detection window: 5 failures in 15 minutes per IP triggers alert
const BRUTE_FORCE_THRESHOLD = 5;
const BRUTE_FORCE_WINDOW_MS = 15 * 60 * 1000;
const failedAttempts = {}; // { [ip]: { count, firstAt } }

// ─── SEVERITY MAP ─────────────────────────────────────────────────────
const SEVERITY_MAP = {
  failed_login: 'medium',
  brute_force: 'critical',
  rate_limit: 'low',
  suspicious_ip: 'high',
  token_abuse: 'critical',
  invalid_token: 'medium',
  account_locked: 'high',
  permission_denied: 'medium',
  suspicious_request: 'high',
  anomaly_detected: 'high',
  password_reset_requested: 'low',
  password_reset_completed: 'medium',
  // Someone is submitting reset tokens that don't resolve — either a stale link
  // or an attacker guessing. Worth surfacing.
  password_reset_failed: 'high',
  two_factor_challenged: 'low',
  two_factor_success: 'low',
  // A wrong OTP means someone already had the correct password. That is the
  // signal that 2FA just earned its keep — page it, don't bury it.
  two_factor_failed: 'high',
  two_factor_enabled: 'low',
  two_factor_disabled: 'high',
  phone_verified: 'low',
};

// ─── CORE RECORDER ────────────────────────────────────────────────────
async function recordSecurityEvent(type, data = {}) {
  const event = {
    type,
    severity: SEVERITY_MAP[type] || 'medium',
    ipAddress: data.ip || 'unknown',
    userAgent: data.userAgent || '',
    userId: data.userId || undefined,
    email: data.email || undefined,
    endpoint: data.endpoint || '',
    details: data.details || {},
    createdAt: new Date(),
  };

  // In-memory ring buffer (newest first)
  recentEvents.unshift(event);
  if (recentEvents.length > MAX_IN_MEMORY) {
    recentEvents = recentEvents.slice(0, MAX_IN_MEMORY);
  }

  // Persist non-blocking — never fail the request
  SecurityEvent.create(event).catch(() => {});

  return event;
}

// ─── SPECIALIZED RECORDERS ────────────────────────────────────────────
async function recordFailedLogin(ip, email, userAgent, endpoint) {
  const now = Date.now();
  const entry = failedAttempts[ip];

  if (!entry || now - entry.firstAt > BRUTE_FORCE_WINDOW_MS) {
    failedAttempts[ip] = { count: 1, firstAt: now };
  } else {
    failedAttempts[ip].count++;
  }

  const attempts = failedAttempts[ip].count;

  if (attempts >= BRUTE_FORCE_THRESHOLD) {
    delete failedAttempts[ip];
    return recordSecurityEvent('brute_force', {
      ip,
      email,
      userAgent,
      endpoint,
      details: { attempts },
    });
  }

  return recordSecurityEvent('failed_login', { ip, email, userAgent, endpoint });
}

async function recordRateLimit(ip, endpoint, userAgent) {
  return recordSecurityEvent('rate_limit', { ip, endpoint, userAgent });
}

async function recordPermissionDenied(ip, userId, email, endpoint) {
  return recordSecurityEvent('permission_denied', { ip, userId, email, endpoint });
}

async function recordInvalidToken(ip, endpoint, userAgent) {
  return recordSecurityEvent('invalid_token', { ip, endpoint, userAgent });
}

// ─── SUMMARY STATS ────────────────────────────────────────────────────
function getSecuritySummary() {
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent = recentEvents.filter(e => e.createdAt >= last24h);

  const byType = {};
  const bySeverity = { low: 0, medium: 0, high: 0, critical: 0 };
  const byIp = {};

  for (const e of recent) {
    byType[e.type] = (byType[e.type] || 0) + 1;
    bySeverity[e.severity] = (bySeverity[e.severity] || 0) + 1;
    byIp[e.ipAddress] = (byIp[e.ipAddress] || 0) + 1;
  }

  const suspiciousIps = Object.entries(byIp)
    .filter(([, c]) => c >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([ip, count]) => ({ ip, count }));

  return {
    total24h: recent.length,
    byType,
    bySeverity,
    suspiciousIps,
    criticalCount: bySeverity.critical,
    highCount: bySeverity.high,
  };
}

function getRecentEvents(limit = 50) {
  return recentEvents.slice(0, limit);
}

module.exports = {
  recordSecurityEvent,
  recordFailedLogin,
  recordRateLimit,
  recordPermissionDenied,
  recordInvalidToken,
  getRecentEvents,
  getSecuritySummary,
};
