# Redis Caching Integration Guide

## Architecture Overview

Redis is integrated as an **enterprise-grade caching layer** with stampede protection,
performance observability, cache pre-warming, and full graceful degradation.  
If Redis is unavailable, the application operates normally using MongoDB directly.

```
Client → Express → Redis Rate Limiter → Cache Middleware → Controller → Service → MongoDB
                      ↕                      ↕
                   Redis (atomic counters)  Redis (cached responses)
                                               ↕
                                          Stampede Protection
                                          (in-memory lock map)
```

## Setup

### 1. Install Redis

- **Local**: [redis.io/download](https://redis.io/download) or `brew install redis` (macOS)
- **Docker**: `docker run -d -p 6379:6379 redis:7-alpine`
- **Cloud**: Redis Cloud, AWS ElastiCache, Azure Cache for Redis

### 2. Configure Environment

In `backend/.env`:

```env
REDIS_URL=redis://127.0.0.1:6379
```

For production with auth:

```env
REDIS_URL=redis://username:password@your-redis-host:6379
```

## Key Naming Strategy

| Key Pattern                      | Description                    | TTL           |
| -------------------------------- | ------------------------------ | ------------- |
| `courses:all`                    | All published courses list     | 5 min (300s)  |
| `course:{id}`                    | Single course by ID or slug    | 10 min (600s) |
| `course:{id}:modules`            | Modules for a course           | 5 min (300s)  |
| `module:{id}:lessons`            | Lessons for a module           | 5 min (300s)  |
| `dashboard:stats`                | Admin dashboard analytics      | 1 min (60s)   |
| `enrollment:{userId}:{courseId}` | Enrollment status              | 5 min (300s)  |
| `progress:{userId}:{courseId}`   | User course progress dashboard | 2 min (120s)  |
| `rl:global:{ip}`                 | Global rate limit counter      | 1 min (60s)   |

### Naming Conventions

- **Singular resource names**: `module:{id}:lessons` (not `modules:`)
- **Colon-separated hierarchy**: `resource:identifier:sub-resource`
- **User-scoped keys** include `userId` to prevent cross-user leakage
- **Short TTLs** for user-specific data (progress, enrollment)
- **Longer TTLs** for public/static data (courses catalog)

## TTL Strategy

| Data Type           | TTL    | Rationale                                                      |
| ------------------- | ------ | -------------------------------------------------------------- |
| Course catalog      | 5 min  | Rarely changes; admin edits invalidate immediately             |
| Single course       | 10 min | Stable data; cache-busted on admin update/delete               |
| Dashboard analytics | 60s    | 13-query aggregation is expensive; 1 min staleness acceptable  |
| User progress       | 120s   | Changes on lesson complete - short TTL + explicit invalidation |
| Enrollment status   | 5 min  | Rarely changes after creation                                  |
| Rate limit counters | 60s    | Sliding window; auto-expires                                   |

## Cache Invalidation

Automatic invalidation occurs on write operations:

| Admin Action                | Invalidated Keys                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Create course               | `courses:all`                                                                                                       |
| Update course               | `courses:all`, `course:{id}`, `course:{slug}`, `course:{id}:modules`                                                |
| Delete course               | `courses:all`, `course:{id}`, `course:{slug}`, `course:{id}:modules`, `module:{moduleId}:lessons` (for each module) |
| Create/update/delete module | `course:{courseId}:modules`                                                                                         |
| Create/update/delete lesson | `module:{moduleId}:lessons`                                                                                         |
| Enroll user                 | `enrollment:{userId}:{courseId}`, `dashboard:stats`                                                                 |
| Complete lesson             | `progress:{userId}:{courseId}`                                                                                      |
| Submit quiz                 | `progress:{userId}:{courseId}`                                                                                      |

## Rate Limiting

Two-layer rate limiting:

1. **In-memory (express-rate-limit)**: 120 req/min global, 20 req/15min on `/api/v1/auth`
2. **Redis-backed**: 100 req/min per IP with atomic counters

Response headers:

- `X-RateLimit-Limit: 100`
- `X-RateLimit-Remaining: 97`

If Redis is down, the Redis layer passes through and in-memory rate limiting still protects the app.

## Files Modified/Created

### Created

- `backend/src/infrastructure/cache/redis.js` - Connection, get/set/del/incr/flushPattern, stampede protection, perf counters
- `backend/src/infrastructure/cache/cacheWarmer.js` - Cache pre-warming on server start
- `backend/src/middlewares/cache.middleware.js` - Stampede-protected response caching with observability headers
- `backend/src/middlewares/rateLimit.middleware.js` - Redis-backed rate limiter

### Modified

- `backend/.env` - Added `REDIS_URL`
- `backend/src/config/env.js` - Added `REDIS_URL` config
- `backend/src/server.js` - Bootstrap with `connectRedis()`, `warmCache()`, graceful shutdown
- `backend/src/app.js` - Added `redisRateLimit` middleware, cache stats in `/health` endpoint
- `backend/src/modules/courses/courses.routes.js` - Cache on GET routes
- `backend/src/modules/admin/admin.routes.js` - Cache on dashboard
- `backend/src/modules/admin/admin.service.js` - Invalidation on course/module/lesson CRUD
- `backend/src/modules/enrollments/enrollments.service.js` - Enrollment caching + invalidation
- `backend/src/modules/learning/learningEngine.service.js` - Progress caching, S3 signed URL TTL hardened to 600s
- `backend/src/utils/s3.js` - Default signed URL TTL reduced from 3600s to 600s

## Enterprise Features

### Stampede Protection

`cacheGetOrSet(key, ttl, computeFn)` prevents cache stampedes (thundering herd):

1. On cache **HIT** → returns immediately
2. On cache **MISS** → acquires an in-memory lock for the key
3. Concurrent requests for the **same key** coalesce onto the same promise
4. Only **one** DB query executes; all waiters receive the same result
5. Lock auto-releases in a `finally` block (guaranteed cleanup)

```js
const data = await cacheGetOrSet('courses:all', 300, async () => {
  return Course.find({ isPublished: true }).lean();
});
```

### Cache Pre-Warming

On server startup, `warmCache()` pre-populates critical cache keys:

- `courses:all` - published courses list (TTL 300s)
- `dashboard:stats` - admin dashboard analytics (TTL 60s)

Pre-warming is **non-fatal**: if it fails, the server still starts normally and
keys are populated on first request via stampede-protected miss.

### Performance Observability

**In-memory counters** tracked via `getCacheStats()`:

| Counter            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `hits`             | Total cache hits                                 |
| `misses`           | Total cache misses                               |
| `errors`           | Total Redis errors (get + set)                   |
| `stampedesBlocked` | Concurrent requests coalesced (stampede avoided) |
| `hitRate`          | Computed hit rate percentage                     |

**Response headers** added by cache middleware:

| Header            | Example         | Description                      |
| ----------------- | --------------- | -------------------------------- |
| `X-Cache`         | `HIT` or `MISS` | Whether response came from cache |
| `X-Cache-Key`     | `courses:all`   | Cache key used                   |
| `X-Response-Time` | `12ms`          | Total response time              |

**Health endpoint** (`GET /health`) includes cache stats:

```json
{
  "status": "ok",
  "redis": "connected",
  "cache": { "hits": 450, "misses": 23, "errors": 0, "stampedesBlocked": 7, "hitRate": "95.1%" }
}
```

### S3 Video Security

Signed download URLs use a **10-minute TTL** (600s) instead of the previous 2-hour window.
This limits the exposure window if a URL is leaked or shared.

## Graceful Degradation

- Redis connection is **non-blocking** - server starts in ~3s even without Redis
- All `cacheGet` calls return `null` when Redis is down → DB is queried normally
- All `cacheSet`/`cacheDel` calls silently fail when Redis is down
- Rate limiter falls back to allowing requests (in-memory limiter is still active)
- Background reconnect tries 5 times then stops gracefully
