const { createClient } = require('redis');
const { logger } = require('../observability/logger');

let client = null;
let isConnected = false;

// In-process fallback used only while Redis is down. Per-process, so with several PM2 workers
// an invalidation reaches only the worker that made it; TTLs are capped to bound staleness.
const MEMORY_MAX_ENTRIES = 1000;
const MEMORY_MAX_TTL_SECONDS = 60;
const memory = new Map();

function memoryGet(key) {
  const entry = memory.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    memory.delete(key);
    return null;
  }
  return entry.value;
}

function memorySet(key, value, ttlSeconds) {
  if (memory.size >= MEMORY_MAX_ENTRIES) memory.delete(memory.keys().next().value);
  const ttl = Math.min(ttlSeconds || MEMORY_MAX_TTL_SECONDS, MEMORY_MAX_TTL_SECONDS);
  memory.set(key, { value: JSON.parse(JSON.stringify(value)), expiresAt: Date.now() + ttl * 1000 });
}

function memoryDelPattern(pattern) {
  const source = String(pattern)
    .split('*')
    .map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  const re = new RegExp(`^${source}$`);
  for (const key of memory.keys()) if (re.test(key)) memory.delete(key);
}

// ─── PERF COUNTERS ─────────────────────────────────────────────
const stats = { hits: 0, misses: 0, errors: 0, stampedesBlocked: 0 };

function getCacheStats() {
  const total = stats.hits + stats.misses;
  return {
    ...stats,
    total,
    hitRate: total > 0 ? ((stats.hits / total) * 100).toFixed(1) + '%' : '0%',
  };
}

// ─── CONNECTION ─────────────────────────────────────────────────
async function connectRedis() {
  const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  const workerId = process.env.pm_id || process.pid;

  client = createClient({
    url,
    socket: {
      // tls: true, // Use TLS for secure connection (rediss://)
      // rejectUnauthorized: false, // Allow self-signed certs (if using Redis Labs or similar)
      // Never give up: Redis may come back later, and the memory fallback covers the gap.
      reconnectStrategy: retries => {
        if (retries === 10 || retries % 100 === 0) {
          logger.warn('Redis: still unreachable, retrying every 30s (using in-memory cache)', { worker: workerId, retries });
        }
        return Math.min(retries * 500, 30000);
      },
      connectTimeout: 5000,
      keepAlive: 30000, // TCP keep-alive every 30s
    },
  });

  client.on('connect', () => {
    logger.info('Redis: connected');
    isConnected = true;
  });

  client.on('ready', () => {
    logger.info('Redis: ready');
    isConnected = true;
    memory.clear();
  });

  client.on('error', err => {
    if (isConnected) {
      logger.error('Redis: error', { message: err.message });
    }
    isConnected = false;
  });

  client.on('end', () => {
    logger.warn('Redis: connection closed');
    isConnected = false;
  });

  client.connect().catch(err => {
    logger.warn('Redis: initial connection failed - running without cache', {
      message: err.message,
    });
    isConnected = false;
  });

  await new Promise(resolve => {
    const readyHandler = () => {
      cleanup();
      resolve();
    };
    const errorHandler = () => {
      cleanup();
      resolve();
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, 3000);
    function cleanup() {
      clearTimeout(timer);
      client.removeListener('ready', readyHandler);
      client.removeListener('error', errorHandler);
    }
    client.once('ready', readyHandler);
    client.once('error', errorHandler);
  });

  if (isConnected) {
    logger.info('Redis: cache layer active');
  } else {
    logger.warn('Redis: unavailable - app will use DB directly');
  }
}

/** @returns {boolean} */
function isRedisReady() {
  return isConnected && client !== null && client.isReady;
}

// ─── CORE GET / SET / DEL ───────────────────────────────────────

async function cacheGet(key) {
  if (!isRedisReady()) return memoryGet(key);
  const start = Date.now();
  try {
    const raw = await client.get(key);
    const elapsed = Date.now() - start;
    if (raw) {
      stats.hits++;
      logger.debug('cache:hit', { key, ms: elapsed });
      return JSON.parse(raw);
    }
    stats.misses++;
    logger.debug('cache:miss', { key, ms: elapsed });
    return null;
  } catch (err) {
    stats.errors++;
    logger.warn('cache:get:error', { key, message: err.message });
    return null;
  }
}

async function cacheSet(key, value, ttlSeconds = 300) {
  if (!isRedisReady()) return memorySet(key, value, ttlSeconds);
  try {
    const serialized = JSON.stringify(value);
    await client.set(key, serialized, { EX: ttlSeconds });
  } catch (err) {
    stats.errors++;
    logger.warn('cache:set:error', { key, message: err.message });
  }
}

async function cacheDel(...keys) {
  // Clear the fallback too, so nothing stale survives Redis coming back.
  for (const key of keys.flat()) memory.delete(key);
  if (!isRedisReady()) return;
  try {
    await client.del(keys);
  } catch {
    // silent - invalidation is best-effort
  }
}

// ─── STAMPEDE PROTECTION - stale-while-revalidate + mutex ───────

// In-memory lock map to prevent thundering herd within the same process
const _locks = new Map();

/**
 * Get-or-recompute pattern with stampede protection.
 *
 * 1. On cache HIT → return cached value immediately.
 * 2. On cache MISS → acquire a lock so only ONE caller recomputes.
 *    Other concurrent callers wait on the same promise (coalesced).
 * 3. Result is cached with the given TTL + a small stale buffer.
 *
 * @param {string}   key         - Cache key
 * @param {number}   ttlSeconds  - Fresh TTL
 * @param {function} computeFn   - async () => value  (the DB call)
 * @returns {Promise<any>}
 */
async function cacheGetOrSet(key, ttlSeconds, computeFn) {
  // 1. Try cache first
  const cached = await cacheGet(key);
  if (cached !== null) return cached;

  // 2. Check for in-flight lock (request coalescing)
  if (_locks.has(key)) {
    stats.stampedesBlocked++;
    logger.debug('cache:stampede:coalesced', { key });
    return _locks.get(key);
  }

  // 3. Acquire lock - only this caller recomputes
  const promise = (async () => {
    try {
      const value = await computeFn();
      // Write-behind: cache result for next caller
      await cacheSet(key, value, ttlSeconds);
      return value;
    } finally {
      _locks.delete(key);
    }
  })();

  _locks.set(key, promise);
  return promise;
}

// ─── RATE LIMITER SUPPORT ───────────────────────────────────────

async function cacheIncr(key, ttlSeconds) {
  if (!isRedisReady()) return null;
  try {
    const count = await client.incr(key);
    if (count === 1 && ttlSeconds) {
      await client.expire(key, ttlSeconds);
    } else if (ttlSeconds) {
      const ttl = await client.ttl(key);
      if (ttl < 0) {
        await client.expire(key, ttlSeconds);
      }
    }
    return count;
  } catch {
    return null;
  }
}

// ─── PATTERN DELETE (SCAN-based, production-safe) ───────────────

async function cacheFlushPattern(pattern) {
  memoryDelPattern(pattern);
  if (!isRedisReady()) return;
  try {
    for await (const key of client.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      await client.del(key);
    }
  } catch {
    // silent
  }
}

// ─── SHUTDOWN ───────────────────────────────────────────────────

async function disconnectRedis() {
  if (client) {
    try {
      await client.quit();
    } catch {
      // ignore
    }
  }
}

module.exports = {
  connectRedis,
  disconnectRedis,
  isRedisReady,
  cacheGet,
  cacheSet,
  cacheDel,
  cacheGetOrSet,
  cacheIncr,
  cacheFlushPattern,
  getCacheStats,
};
