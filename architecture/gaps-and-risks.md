# Gaps & Risks - Startup India Incubation Platform

## Security Risks

### HIGH

| # | Issue | Location | Status |
|---|-------|----------|--------|
| 1 | ~~No refresh token rotation~~ | `auth.service.js` | **FIXED** - bcrypt hash stored on issue, verified + rotated on refresh, cleared on logout |
| 2 | ~~No CSRF protection~~ | `auth.routes.js` | **FIXED** - cookies upgraded to `sameSite: 'strict'` |
| 3 | ~~Meeting link exposed in list endpoints~~ | `events.service.js` | **FIXED** - `meetingLink` stripped from listEvents for non-registered users |

### MEDIUM

| # | Issue | Location | Status |
|---|-------|----------|--------|
| 4 | ~~`refreshTokenHash` stored but never validated~~ | `user.model.js` | **FIXED** - now validated in refresh flow (bcrypt.compare) |
| 5 | **No rate limiting on most API endpoints** | `app.js` | PARTIAL - admin now has dedicated 120 req/min limiter; per-mutation limits still global-only |
| 6 | ~~Admin endpoints lack additional rate limiting~~ | `admin.routes.js` | **FIXED** - dedicated 120 req/min rate limiter added on `/api/v1/admin` |

---

## Schema Bugs

| # | Issue | Location | Status |
|---|-------|----------|--------|
| 1 | ~~Duplicate `wishlist` field~~ | `user.model.js` | **FIXED** - duplicate removed |

---

## Dead Code / Stubs

| # | Issue | Location | Status |
|---|-------|----------|--------|
| 1 | Facebook login throws 501 | `auth.service.js:loginWithFacebook` | Open - stub remains, not implemented |
| 2 | ~~Commented-out CORS middleware~~ | `app.js` | **FIXED** - removed |
| 3 | ~~Commented-out auth rate limiter~~ | `app.js` | **FIXED** - removed |

---

## Scalability Risks

| # | Issue | Status |
|---|-------|--------|
| 1 | ~~In-process job queue loses jobs on crash~~ | **FIXED** - `jobQueue.drain()` wired into graceful shutdown; `reconcileOrphanedPayments()` runs on every startup to re-enroll any missed payments |
| 2 | **Enrollment count drift** | MITIGATED - `$inc` on create is idempotent (checked existing first); no decrement on cancel (no cancel API yet) |
| 3 | **Event registrations stored as array** | Open - O(n) scan for large events; no indexed sub-document |
| 4 | **Article metrics manual aggregation** | Open - no automated cronjob |

---

## Missing Validations

| # | Issue | Status |
|---|-------|--------|
| 1 | ~~No max length on `bio`, `headline`, `description`~~ | **FIXED** - bio 2000, headline 200, missionStatement 500, course title 200, subtitle 300, description 5000 |
| 2 | ~~No file size/type validation server-side for S3 uploads~~ | Already implemented in `media.service.js` - `validateFileAgainstFolder()` checks MIME + size; `completeUpload` uses S3 `headObject` to verify actual ContentType + ContentLength |
| 3 | ~~No slug format validation~~ | **FIXED** - `course.model.js` slug now has regex validator `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` |

---

## Potential Bottlenecks

| # | Bottleneck | Status |
|---|-----------|--------|
| 1 | Course detail page N+1 | Open - courses.service uses `Promise.all(courses.map(...))` for media signing; modules/lessons loaded via separate queries |
| 2 | Leaderboard query | MITIGATED - `$limit: 50` already caps the aggregate pipeline |
| 3 | Cache stampede cross-worker | MITIGATED - per-process lock in `cacheGetOrSet`; cross-worker stampede possible but low-impact with short TTLs |

---

## Frontend Gaps

| # | Issue | Status |
|---|-------|--------|
| 1 | ~~No real error boundary - `ClientErrorBoundary` was a passthrough~~ | **FIXED** - full React class error boundary with reload button and dev-mode error display |
| 2 | ~~No page-level error boundaries~~ | **FIXED** - `PageErrorBoundary` component created for wrapping individual page sections |
| 3 | `unsafe-inline` in CSP `styleSrc` | Open - required by Framer Motion inline styles + Tailwind; fix requires nonce-based CSP (Next.js middleware + Helmet update) |
| 4 | Multiple overlapping CSS files | Open - 7-layer CSS system; monitored via visual regression testing |
