# Engineering & Optimization Audit — Startups India

Status: **Not ready for production sign-off.** The P0 fixes are on branch `audit/production-hardening` and have **not** been pushed or deployed. Rotating the leaked key and upgrading Next.js still need owner action (see §8).

| | |
|---|---|
| Audit started | 2026-11-12 |
| Baseline | `origin/main` @ `36cb326` (2026-09-22) |
| Work branch | `audit/production-hardening` (4 commits, local only) |

## 1. System assessment

- **Frontend**: Next.js 14.2.35 App Router (`frontend/`), deployed on Vercel. Jest has 1 suite.
- **Backend**: Express 4 + Mongoose 8 (`backend/src`), about 24.8k LOC across 25 modules. It runs on EC2 under PM2 behind nginx and deploys by rsync from GitHub Actions.
- **Data**: MongoDB Atlas, with Redis as an optional cache. Every cache helper becomes a no-op when Redis is down.
- **Integrations**: Razorpay (primary payments, plus webhooks), Stripe, AWS S3, Firebase push, SMTP, 2Factor/MSG91 SMS, and Google OAuth.
- **Auth**: JWT access token (15m) in a Bearer header or cookie. The role is read from the token claim. Admin routes sit under a secret slug, and `/api/v1/admin` is a hard 404.

### Repository state found
- Local `main` had diverged from `origin/main` (6 commits ahead, 16 behind). `origin/main` lacks the QR scan-tracking feature (`scanRouter`, `POST /api/v1/campaigns/scan`, a middleware ping). It looks like origin was rebuilt from the `events` branch without it. Those commits are preserved in the local tag `archive/qr-scan-tracking`.
- At the owner's request (2026-11-12), the old team's branches were deleted on GitHub (`dev`, `events`, `fix/onboarding-tokens`, `fix/role-enum`) and locally. Their tips are kept as local tags `archive/*`. `fix/onboarding-tokens` held 2 unmerged commits that re-issue tokens after onboarding.
- An untracked one-off script, `backend/send-payment-link.js`, contained customer PII. It documented a live incident in which a customer was charged ₹1.18 instead of ₹1,768.82. It was never committed and was deleted on 2026-11-12.

## 2. Findings (ranked)

| ID | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| S1 | P0 | 2Factor SMS API key hardcoded as an env fallback | `config/env.js:74` (in git history) | Fallback removed; **key must be rotated** |
| S2 | P0 | Generic `POST /admin/settings` writes any `grant.*` key with any raw value. It bypasses validation and never clears the `grant:settings` cache. The general settings page sends fees as strings, and `base + gst` then concatenates strings | `admin.service.upsertSetting`, `grant.settings.computeEvaluationFee` | Fixed + tests |
| S3 | P0 | `GET /courses/modules/:id/lessons` is public and returns full lessons (`videoUrl`, `readingContent`, `quizQuestions`, attachments) | Route has no auth; the baseline probe reached the DB unauthenticated | Fixed + tests |
| S4 | P1 | `/courses/:id/materials` is served to any logged-in user, enrolled or not | `courses.routes.js` | Fixed + tests |
| P1 | P1 | Grant evaluation payments have no webhook or reconciliation path. A founder who pays and closes the tab is charged, and the application stays unpaid | The webhook only queries `Payment` | Fixed: webhook settles grant orders after an amount/currency check |
| P2 | P1 | An invalid client signature marks the grant order `failed`, after which a genuine capture can never settle | `verifyEvaluationPayment` | Fixed + tests |
| P3 | P2 | HMAC comparisons use `===` (not constant-time) | `payments.service.js` | Fixed |
| S5 | P1 | Admin rate limiter is mounted on `/api/v1/admin` (the decoy 404), so the real admin API has only the global limit | `app.js` | Fixed + test |
| D1 | P1 | Backend deps: 2 critical, 24 high (mongoose sanitizeFilter bypass, proxy-addr IP spoofing, nodemailer recipient injection, axios, body-parser) | `pnpm audit --prod` | Now 0 critical, 2 high |
| D2 | P1 | Frontend: Next.js 14.2.35 has 3 critical advisories (Image Optimizer RCE, Windows RCE) plus about 10 high. All are fixed only in 15.5.x | `pnpm audit --prod` (36 vulns) | **Needs approval** (major migration) |
| C1 | P1 | CI on `main` is red (Backend Safety and Code Quality), the frontend Build job is skipped, and the backend still auto-deploys because the deploy doesn't depend on CI | `gh run list` | Fixed: deploy `needs: verify`, CI fixture corrected |
| R1 | P2 | Boot-time `reconcileOrphanedPayments` makes 1 + n queries over all historical payments on every PM2 worker boot | `enrollments.service.js` | Fixed: one aggregation |
| Q1 | P2 | Dead code: 4 nested dirs (`config/config.js/`, `middlewares/security.js/`, `utils/performance.js/`, `utils/specialUser.js/`) use ESM syntax inside CJS, are never required, and one holds a demo password | grep: no references | Removed |
| Q2 | P2 | Duplicate route registrations (wishlist, complete) and duplicate `trust proxy` | `courses.routes.js`, `app.js` | Removed |
| Q3 | P3 | Accidental self-dependency `"incubation-platform": "file:.."` | `backend/package.json` | Removed |
| O1 | P2 | `EvaluationPayment.orderId` index is not unique, although the code comment says it should be | `grant.models.js:226` | Open: needs a data check before a unique index |
| O2 | P2 | Roles come from the JWT, so a demoted or deleted admin keeps access for up to 15 min | `authMiddleware.js` | Open |
| O3 | P2 | Two admin pages edit grant fees (`/admin/settings` and `/admin/grants/settings`) | frontend | Mitigated (backend now validates both); consolidate UI |
| O4 | P2 | `markCourseCompleted` and `markCourseComplete` are duplicates and throw plain `Error` (returns 500 instead of 403) | `courses.service.js` | Open |
| O5 | P2 | `xlsx` 0.18.5 (prototype pollution, ReDoS) parses admin-uploaded CRM files; no npm release has the fix | `crm.import.service.js` | Needs approval (switch to the SheetJS CDN tarball) |
| O6 | P2 | `zod` 3: memory exhaustion on oversized collections; the fix exists only in v4 | audit | Open (major) |
| O7 | P3 | Mongoose duplicate-index warnings (`slug`, `paymentOrderId`, `shortCode`) | boot log | Open |
| O8 | P3 | 493 frontend files were never Prettier-formatted | `prettier --check` | CI now checks changed files; coordinated format commit pending |
| O9 | P2 | QR scan tracking is missing from `origin/main`, so QR campaigns record no scans | branch diff | Decision needed; the public endpoint also accepts a client-supplied IP/UA (spoofable counts) |

## 3. Changes implemented (`audit/production-hardening`)

1. `12277a3` fix(security,payments): S1–S5, P1–P3, Q1, Q2, plus the test suite.
2. `9d3a520` chore(deps): D1, Q3.
3. `481709e` ci: C1.
4. `69ebbb9` perf(enrollments): R1.

## 4. Complexity / performance

- **R1**: round-trips go from 1 + n to 1 per boot per worker. The memory footprint drops from every succeeded course payment to only the orphaned ones. **Not benchmarked**: no database was available.
- **S3**: the projection now excludes quiz and attachment payloads from the public listing, so the response is smaller. Not measured.

## 5. Tests and commands executed

| Command | Result |
|---|---|
| `pnpm test` (backend, new `node:test` suite) | **21/21 pass** |
| Same suite run against the original `src/` | 12 of 19 fail (the tests detect the defects) |
| `pnpm audit --prod` (backend) before/after | 2C/24H/29M/2L → 0C/2H/0M/1L |
| `pnpm audit --prod` (frontend) | 3C/16H/14M/3L (unchanged) |
| `next lint` (frontend) | clean |
| `jest --ci` (frontend) | 6/6 pass (1 suite) |
| CI boot fixture reproduced locally (prod config, module load) | passes after the fixture fix |
| `scripts/check-case-imports.js` | passes |
| nodemailer 10 `createTransport` + `sendMail` (jsonTransport) | passes |

**Not tested**: anything against a real MongoDB or Redis (the Docker engine isn't running), Razorpay sandbox end-to-end, frontend build, and the GitHub Actions run of the edited workflows.

## 6. Deployment steps and rollback

Before deploying the branch:
1. **Rotate the 2Factor API key** in the 2Factor dashboard, then set `TWOFACTOR_API_KEY` in the EC2 `backend/.env`. Without it, phone OTP fails once the fallback is gone.
2. In the Razorpay dashboard, confirm the webhook subscribes to `payment.captured` and that `RAZORPAY_WEBHOOK_SECRET` is set on EC2. Grant orders now depend on it.
3. Inspect the `settings` rows for `grant.*` keys whose value is stored as a string. Re-save them via Admin → Grants → Settings.
4. After deploy, cached public lesson payloads (`module:*:lessons`) expire within 300s. Flush them to close the leak immediately.
5. Look for grant `EvaluationPayment` rows with `status: 'failed'` that Razorpay shows as captured. Those are victims of P2 and can be reconciled.

Rollback: revert the branch's commits, or redeploy the previous `src/` from `~/.deploy-backups/` on EC2. No schema or data migrations were made.

## 7. Next priorities

1. Next.js 15.5 migration (D2), on its own branch, with a full build and route smoke test.
2. Decide on QR scan tracking (O9), restoring it from `archive/qr-scan-tracking` with server-derived IP.
3. Unique index on `EvaluationPayment.orderId` (O1) after a duplicate check.
4. Integration tests against a disposable MongoDB (Docker) for the payment and enrollment flows.
5. Continue the audit of modules not yet reviewed in depth: auth (967-line routes file), media uploads, events, CRM, mentors/investors, and the frontend pages.
