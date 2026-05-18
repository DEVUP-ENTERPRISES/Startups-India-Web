# Onboarding Guide — Startup India Incubation Platform

Welcome! This guide gets you productive in under 30 minutes.

---

## What Is This Project?

**Startup India Incubation Platform** — an online learning + incubation platform for Indian entrepreneurs.

Users can:
- Enroll in startup courses (free + paid via Razorpay/Stripe)
- Attend live/recorded classes
- Take quizzes and assessments
- Get completion certificates (auto-generated, publicly verifiable)
- Join community (discussions, groups, Q&A)
- Register for events (free + paid)
- Connect with mentors and investors

Admins can:
- Manage courses, users, enrollments, payments, events, articles
- View analytics and monitoring dashboards
- Manage leads, testimonials, settings

---

## Repository Structure (Quick Map)

```
/apps/web         → Next.js 14 frontend (what users see)
/backend          → Express.js REST API (all business logic + data)
/infra            → Nginx, AWS, deployment scripts
/architecture     → This folder — compressed architecture docs
```

---

## How to Start Dev Environment

```bash
# 1. Install all dependencies
npm install && npm --prefix apps/web install && npm --prefix backend install

# 2. Set up backend env (copy and fill in values)
cp backend/.env.example backend/.env
# Required: MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET

# 3. Set up frontend env
# apps/web/.env.local already exists — add NEXT_PUBLIC_API_URL=http://localhost:5000

# 4. Start everything
npm run dev:full   # starts backend (port 5000) + frontend (port 3000)

# Or separately:
npm run dev:backend   # backend only
npm run dev           # frontend only
```

---

## Key Files to Read First

| Priority | File | Why |
|----------|------|-----|
| 1 | `architecture/project-map.md` | Complete folder structure |
| 2 | `backend/src/routes/index.js` | All 20 API route groups |
| 3 | `backend/src/app.js` | Middleware stack, CORS, rate limits |
| 4 | `backend/src/config/env.js` | All env vars used |
| 5 | `apps/web/app/layout.js` | Root layout, CSS loading order |

---

## Where Business Logic Lives

| Business Need | Files |
|--------------|-------|
| Auth (login/signup/OAuth) | `backend/src/modules/auth/auth.service.js` |
| Course purchase flow | `backend/src/modules/payments/payments.service.js` |
| Enrollment creation | `backend/src/modules/enrollments/enrollments.service.js` |
| Lesson progress tracking | `backend/src/modules/learning/learning.service.js` |
| Certificate generation | `backend/src/modules/certificates/certificates.service.js` |
| Event registration | `backend/src/modules/events/events.service.js` |
| Admin dashboard data | `backend/src/modules/admin/admin.service.js` |

---

## Where DB Logic Lives

All database models:
| Domain | Model File |
|--------|-----------|
| Users | `backend/src/modules/users/user.model.js` |
| Courses + Modules + Lessons | `backend/src/modules/courses/course.model.js` |
| Enrollments + Progress | `backend/src/modules/enrollments/enrollment.model.js` |
| Payments + Subscriptions | `backend/src/modules/payments/payment.model.js` |
| Certificates | `backend/src/modules/certificates/certificate.model.js` |
| Articles | `backend/src/models/Article.js` |
| Events | `backend/src/models/Event.js` |
| Community | `backend/src/modules/community/community.model.js` |
| Achievements/Badges | `backend/src/modules/achievements/achievements.model.js` |
| Mentor/Investor profiles | `backend/src/modules/profiles/mentor.model.js` |

---

## Where APIs Live

All APIs are at `/api/v1/*` — full list in `architecture/api-map.md`.

Key groups:
```
/api/v1/auth          → login, signup, Google OAuth
/api/v1/users         → user profile, wishlist
/api/v1/courses       → course catalog
/api/v1/learn         → learning engine (lesson access, completion)
/api/v1/enrollments   → enrollment management
/api/v1/payments      → Stripe + Razorpay + webhooks
/api/v1/certificates  → generate + verify certificates
/api/v1/events        → event registration
/api/v1/admin         → admin panel data
/api/v1/public        → public data (no auth needed)
/health               → system health check
```

---

## Where Configs Live

| Config | Location |
|--------|----------|
| Backend env vars | `backend/.env` (see `backend/src/config/env.js` for all keys) |
| Frontend env vars | `apps/web/.env.local` |
| CORS allowed origins | `backend/src/app.js:77–85` |
| Maintenance mode toggle | `apps/web/config/maintenance.js` → `MAINTENANCE_MODE` |
| PM2 process config | `backend/ecosystem.config.js` |
| Nginx config | `infra/nginx/nginx.conf` |

---

## Frontend Pages (Clickable Routes)

### Public Pages
| Route | File |
|-------|------|
| `/` (Homepage) | [apps/web/app/page.js](../apps/web/app/page.js) |
| `/about` | [apps/web/app/about/page.js](../apps/web/app/about/page.js) |
| `/courses` | [apps/web/app/courses/page.js](../apps/web/app/courses/page.js) |
| `/courses/[slug]` | [apps/web/app/courses/[slug]/page.js](../apps/web/app/courses/[slug]/page.js) |
| `/events` | [apps/web/app/events/page.js](../apps/web/app/events/page.js) |
| `/events/[id]` | [apps/web/app/events/[id]/page.js](../apps/web/app/events/[id]/page.js) |
| `/mentors` | [apps/web/app/mentors/page.js](../apps/web/app/mentors/page.js) |
| `/investors` | [apps/web/app/investors/page.js](../apps/web/app/investors/page.js) |
| `/programs` | [apps/web/app/programs/page.js](../apps/web/app/programs/page.js) |
| `/programs/pre-incubation` | [apps/web/app/programs/pre-incubation/page.js](../apps/web/app/programs/pre-incubation/page.js) |
| `/programs/incubation` | [apps/web/app/programs/incubation/page.js](../apps/web/app/programs/incubation/page.js) |
| `/programs/growth` | [apps/web/app/programs/growth/page.js](../apps/web/app/programs/growth/page.js) |
| `/programs/master-classes` | [apps/web/app/programs/master-classes/page.js](../apps/web/app/programs/master-classes/page.js) |
| `/source` (Blog/Articles) | [apps/web/app/source/page.js](../apps/web/app/source/page.js) |
| `/source/[slug]` | [apps/web/app/source/[slug]/page.js](../apps/web/app/source/[slug]/page.js) |
| `/team` | [apps/web/app/team/page.js](../apps/web/app/team/page.js) |
| `/market-access` | [apps/web/app/market-access/page.js](../apps/web/app/market-access/page.js) |
| `/verify/[certificateNumber]` | [apps/web/app/verify/[certificateNumber]/page.js](../apps/web/app/verify/[certificateNumber]/page.js) |

### Auth Pages
| Route | File |
|-------|------|
| `/login` | [apps/web/app/login/page.js](../apps/web/app/login/page.js) |
| `/signup` | [apps/web/app/signup/page.js](../apps/web/app/signup/page.js) |

### User Dashboard
| Route | File |
|-------|------|
| `/dashboard` | [apps/web/app/dashboard/page.js](../apps/web/app/dashboard/page.js) |
| `/dashboard/courses` | [apps/web/app/dashboard/courses/page.js](../apps/web/app/dashboard/courses/page.js) |
| `/dashboard/my-courses` | [apps/web/app/dashboard/my-courses/page.js](../apps/web/app/dashboard/my-courses/page.js) |
| `/dashboard/explore-courses` | [apps/web/app/dashboard/explore-courses/page.js](../apps/web/app/dashboard/explore-courses/page.js) |
| `/dashboard/certificates` | [apps/web/app/dashboard/certificates/page.js](../apps/web/app/dashboard/certificates/page.js) |
| `/dashboard/achievements` | [apps/web/app/dashboard/achievements/page.js](../apps/web/app/dashboard/achievements/page.js) |
| `/dashboard/achievements/badges` | [apps/web/app/dashboard/achievements/badges/page.js](../apps/web/app/dashboard/achievements/badges/page.js) |
| `/dashboard/achievements/leaderboard` | [apps/web/app/dashboard/achievements/leaderboard/page.js](../apps/web/app/dashboard/achievements/leaderboard/page.js) |
| `/dashboard/payments` | [apps/web/app/dashboard/payments/page.js](../apps/web/app/dashboard/payments/page.js) |
| `/dashboard/payments/billing` | [apps/web/app/dashboard/payments/billing/page.js](../apps/web/app/dashboard/payments/billing/page.js) |
| `/dashboard/payments/purchases` | [apps/web/app/dashboard/payments/purchases/page.js](../apps/web/app/dashboard/payments/purchases/page.js) |
| `/dashboard/payments/subscriptions` | [apps/web/app/dashboard/payments/subscriptions/page.js](../apps/web/app/dashboard/payments/subscriptions/page.js) |
| `/dashboard/community/discussions` | [apps/web/app/dashboard/community/discussions/page.js](../apps/web/app/dashboard/community/discussions/page.js) |
| `/dashboard/community/groups` | [apps/web/app/dashboard/community/groups/page.js](../apps/web/app/dashboard/community/groups/page.js) |
| `/dashboard/community/doubts` | [apps/web/app/dashboard/community/doubts/page.js](../apps/web/app/dashboard/community/doubts/page.js) |
| `/dashboard/analytics/*` | [apps/web/app/dashboard/analytics/](../apps/web/app/dashboard/analytics/) |
| `/dashboard/assessment/*` | [apps/web/app/dashboard/assessment/](../apps/web/app/dashboard/assessment/) |
| `/dashboard/learning/live` | [apps/web/app/dashboard/learning/live/page.js](../apps/web/app/dashboard/learning/live/page.js) |
| `/dashboard/learning/recorded` | [apps/web/app/dashboard/learning/recorded/page.js](../apps/web/app/dashboard/learning/recorded/page.js) |
| `/dashboard/learning/notes` | [apps/web/app/dashboard/learning/notes/page.js](../apps/web/app/dashboard/learning/notes/page.js) |
| `/dashboard/settings` | [apps/web/app/dashboard/settings/page.js](../apps/web/app/dashboard/settings/page.js) |
| `/dashboard/wishlist` | [apps/web/app/dashboard/wishlist/page.js](../apps/web/app/dashboard/wishlist/page.js) |

### Learning
| Route | File |
|-------|------|
| `/learn` | [apps/web/app/learn/page.js](../apps/web/app/learn/page.js) |
| `/learn/[courseId]` | [apps/web/app/learn/[courseId]/page.js](../apps/web/app/learn/[courseId]/page.js) |
| `/checkout` | [apps/web/app/checkout/page.js](../apps/web/app/checkout/page.js) |
| `/quiz/[id]` | [apps/web/app/quiz/[id]/page.js](../apps/web/app/quiz/[id]/page.js) |
| `/certificate` | [apps/web/app/certificate/page.js](../apps/web/app/certificate/page.js) |

### Admin Panel
| Route | File |
|-------|------|
| `/admin/dashboard` | [apps/web/app/admin/dashboard/page.js](../apps/web/app/admin/dashboard/page.js) |
| `/admin/users` | [apps/web/app/admin/users/page.js](../apps/web/app/admin/users/page.js) |
| `/admin/courses` | [apps/web/app/admin/courses/page.js](../apps/web/app/admin/courses/page.js) |
| `/admin/enrollments` | [apps/web/app/admin/enrollments/page.js](../apps/web/app/admin/enrollments/page.js) |
| `/admin/payments` | [apps/web/app/admin/payments/page.js](../apps/web/app/admin/payments/page.js) |
| `/admin/events` | [apps/web/app/admin/events/page.js](../apps/web/app/admin/events/page.js) |
| `/admin/events/[id]/registrations` | [apps/web/app/admin/events/[id]/registrations/page.js](../apps/web/app/admin/events/[id]/registrations/page.js) |
| `/admin/articles` | [apps/web/app/admin/articles/page.js](../apps/web/app/admin/articles/page.js) |
| `/admin/articles/create` | [apps/web/app/admin/articles/create/page.js](../apps/web/app/admin/articles/create/page.js) |
| `/admin/articles/[id]/edit` | [apps/web/app/admin/articles/[id]/edit/page.js](../apps/web/app/admin/articles/[id]/edit/page.js) |
| `/admin/certificates` | [apps/web/app/admin/certificates/page.js](../apps/web/app/admin/certificates/page.js) |
| `/admin/assessments` | [apps/web/app/admin/assessments/page.js](../apps/web/app/admin/assessments/page.js) |
| `/admin/leads` | [apps/web/app/admin/leads/page.js](../apps/web/app/admin/leads/page.js) |
| `/admin/notifications` | [apps/web/app/admin/notifications/page.js](../apps/web/app/admin/notifications/page.js) |
| `/admin/testimonials` | [apps/web/app/admin/testimonials/page.js](../apps/web/app/admin/testimonials/page.js) |
| `/admin/monitoring` | [apps/web/app/admin/monitoring/page.js](../apps/web/app/admin/monitoring/page.js) |
| `/admin/settings` | [apps/web/app/admin/settings/page.js](../apps/web/app/admin/settings/page.js) |
| `/admin/login` | [apps/web/app/admin/login/page.js](../apps/web/app/admin/login/page.js) |

### Legal
| Route | File |
|-------|------|
| `/terms` | [apps/web/app/terms/page.js](../apps/web/app/terms/page.js) |
| `/privacy` | [apps/web/app/privacy/page.js](../apps/web/app/privacy/page.js) |
| `/refund` | [apps/web/app/refund/page.js](../apps/web/app/refund/page.js) |
| `/cookies` | [apps/web/app/cookies/page.js](../apps/web/app/cookies/page.js) |

---

## How Requests Flow (End to End)

```
1. User visits /courses on browser
2. Next.js serves the page (SSR or SSG from Vercel)
3. Page component calls GET /api/v1/courses
4. Backend: Nginx → Express app.js → Rate limiter → courses.routes.js
5. coursesController.listCourses → coursesService.listCourses
6. Redis cache check → Cache miss → MongoDB query
7. Results cached in Redis (TTL 300s) → returned to frontend
8. Next.js renders course cards

--- User buys a course ---
9. Checkout page → POST /api/v1/payments/razorpay/order
10. Razorpay order created → Payment record saved (status: created)
11. User pays in Razorpay popup
12. Frontend calls POST /api/v1/payments/razorpay/verify
13. Signature verified → Payment updated (status: succeeded)
14. jobQueue.enqueue('payment.succeeded')
15. Enrollment created → User can now access /learn/[courseId]
```

---

## Running Tests

```bash
npm run test           # jest --watch (interactive)
npm run test:ci        # jest --ci --coverage (CI pipeline)
```

Tests live in `__tests__/` directory.

---

## Common Development Tasks

### Add a new API endpoint
1. Add service function in `backend/src/modules/<domain>/<domain>.service.js`
2. Add controller handler in `<domain>.controller.js`
3. Add route in `<domain>.routes.js`
4. Routes auto-register if the file is already imported in `backend/src/routes/index.js`

### Add a new page
1. Create `apps/web/app/<route>/page.js`
2. If it needs Navbar/Footer, it uses the default layout
3. Add to `ConditionalLayout` if it needs a different layout

### Add a new model
1. Create schema in `backend/src/modules/<domain>/<domain>.model.js`
2. Export the model
3. Import in service layer

### Seed admin account
```bash
# Runs seeder with ADMIN_EMAIL + ADMIN_PASSWORD from .env
node backend/src/utils/seedAdmin.js
```
