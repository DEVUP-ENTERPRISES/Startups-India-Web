# Infrastructure - Startup India Incubation Platform

## Deployment Architecture

```
Production:
  Frontend → Vercel (Next.js 14 SSR/SSG)
           → Domain: learning-startups-india.vercel.app
           → Also: startupsindia.in / www.startupsindia.in

  Backend  → Docker container (Node.js + PM2)
           → Nginx reverse proxy (SSL termination)
           → Domain: API endpoint behind same domain or subdomain

  Database → MongoDB (Cloud - likely Atlas based on URI pattern)
  Cache    → Redis (optional, graceful fallback if unavailable)
  Storage  → AWS S3 (ap-south-1 region)
```

## Process Management (PM2)
**File:** `backend/ecosystem.config.js`
- PM2 cluster mode - multiple workers per CPU
- Env vars injected via PM2 ecosystem config
- Zero-downtime restarts

## Docker
**File:** `backend/Dockerfile` + `docker-compose.yml`

`docker-compose.yml` at root orchestrates:
- Backend Node.js service
- Redis service
- (MongoDB typically external/Atlas in prod)

## Nginx Configuration
**Files:** `infra/nginx/nginx.conf`, `infra/nginx/nginx-docker.conf`

- SSL termination
- Reverse proxy to Node.js on port 5000
- Static file serving
- Gzip compression

## AWS Infrastructure
**File:** `infra/aws/aws-infrastructure.yml`
- CloudFormation/CDK stack definition
- S3 bucket for media uploads (region: ap-south-1)
- Presigned URL uploads (direct browser-to-S3, no backend bandwidth)

## Database: MongoDB

**Mongoose version:** 8.x
**Connection:** `backend/src/config/db.js`

Key collections and their critical indexes:
| Collection | Critical Indexes |
|-----------|-----------------|
| users | email (unique), role+createdAt, providerIds |
| courses | isPublished+createdAt |
| modules | courseId+sortOrder (unique) |
| lessons | moduleId+sortOrder (unique) |
| enrollments | userId+courseId (unique) |
| lessonProgress | userId+courseId+lessonId (unique) |
| payments | userId+createdAt, paymentIntentId, orderId, paymentId |
| certificates | userId+courseId (unique), certificateNumber (unique) |
| articles | status+publishedAt, category, viewsCount |
| groupMembers | groupId+userId (unique) |
| userBadges | userId+badgeId (unique) |

## Cache: Redis
**File:** `backend/src/infrastructure/cache/redis.js`

- Optional - app runs fully without Redis
- TTL-based caching (default 300s)
- Stampede protection via in-memory lock map + request coalescing
- Pattern-based cache invalidation via SCAN iterator
- Rate limiter support via INCR + EXPIRE
- Stats: hits, misses, errors, stampedesBlocked, hitRate

Cache warming: `backend/src/infrastructure/cache/cacheWarmer.js`
Cache middleware: `backend/src/middlewares/cache.middleware.js`

## Job Queue
**File:** `backend/src/infrastructure/jobs/jobQueue.js`

In-process job queue (not Redis-based, not Bull/BullMQ).
Used for:
- `payment.succeeded` → trigger enrollment after payment webhook

## Storage: AWS S3
**File:** `backend/src/utils/s3.js`

- Presigned PUT URLs for direct browser uploads
- Endpoints: `POST /api/v1/upload-url` → `POST /api/v1/upload-complete`
- Only admin and instructor roles can get upload URLs
- Files stored: course thumbnails, lesson videos, course materials, profile images

## Email
**File:** `backend/src/utils/emailService.js` + `emailTemplates.js`

SMTP-based transactional emails:
- Password reset
- Enrollment confirmation
- Certificate issuance
- Event registration confirmation

## Observability
**Files:** `backend/src/infrastructure/observability/logger.js`, `metrics.js`

- **Logger:** Winston-based structured logging (`LOG_LEVEL` env var, default 'info')
- **Metrics:** Custom middleware tracking req count, response times, error rates
  - Available at `GET /metrics`
- **Activity Log:** `utils/activityLogger.js` - per-user activity feed
  - Available at `GET /api/v1/activity`

## Monitoring Scripts
**Files:** `infra/scripts/monitor.sh`, `infra/scripts/deploy.sh`

Shell scripts for:
- Health monitoring
- Zero-downtime deploys
- SSL setup via `setup-ssl.sh`

## Frontend Deployment (Vercel/Netlify)
- `netlify.toml` - Netlify deployment config (alternative to Vercel)
- `next.config.js` - Next.js build configuration
- `.env.local` / `.env.prod` - Frontend env vars (API URLs, Stripe public key, etc.)

## Environment Split

| Env | Backend Port | Frontend Port | CORS |
|-----|-------------|--------------|------|
| Development | 5000 | 3000 | localhost allowed |
| Production | 5000 (behind Nginx) | Vercel | strict whitelist |

## Deployment Scripts

```bash
# Local full-stack dev
npm run dev:full       # starts backend + frontend concurrently

# Backend only
npm run dev:backend

# Frontend only
npm run dev

# Production build
npm run build

# Start all services (Windows)
start-all.bat
```
