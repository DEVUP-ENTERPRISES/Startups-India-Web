# Project Map — Startup India Incubation Platform

## Repository Root
```
startup-india-incubation-main/
├── apps/
│   ├── web/                  ← Next.js 14 frontend (main user-facing app)
│   │   ├── app/              ← Next.js App Router pages
│   │   ├── components/       ← React UI components
│   │   ├── styles/           ← CSS (design system, tokens, pages)
│   │   ├── lib/              ← Frontend utilities, API clients
│   │   ├── hooks/            ← Custom React hooks
│   │   ├── config/           ← Frontend config (maintenance mode, etc.)
│   │   └── public/           ← Static assets
│   ├── admin/                ← Lightweight Node.js admin helper
│   │   ├── index.js          ← Admin server entry
│   │   └── routes.js         ← Admin-specific routes
│   └── .env.production       ← Production env shared across apps
├── backend/
│   ├── src/
│   │   ├── app.js            ← Express app factory (middleware, CORS, security)
│   │   ├── server.js         ← HTTP server entry (DB connect, PM2)
│   │   ├── routes/
│   │   │   ├── index.js      ← Route registry (all /api/v1/*)
│   │   │   └── health.js     ← /health endpoint
│   │   ├── modules/          ← Domain modules (controller + service + model + routes)
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── courses/
│   │   │   ├── enrollments/
│   │   │   ├── payments/
│   │   │   ├── certificates/
│   │   │   ├── learning/
│   │   │   ├── assessments/
│   │   │   ├── achievements/
│   │   │   ├── community/
│   │   │   ├── events/
│   │   │   ├── media/
│   │   │   ├── mentors/
│   │   │   ├── profiles/
│   │   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   ├── settings/
│   │   │   └── public/
│   │   ├── models/           ← Shared top-level models
│   │   │   ├── Article.js
│   │   │   ├── ArticleAnalytics.js
│   │   │   ├── Event.js
│   │   │   ├── EventRegistration.js
│   │   │   ├── Lead.js
│   │   │   ├── Notification.js
│   │   │   ├── Settings.js
│   │   │   └── Testimonial.js
│   │   ├── middlewares/      ← Express middleware
│   │   ├── infrastructure/   ← Redis, job queue, metrics, logger
│   │   ├── config/           ← env, db, logger, maintenance
│   │   └── utils/            ← Helpers (email, S3, tokens, sanitizer, etc.)
│   ├── Dockerfile
│   ├── ecosystem.config.js   ← PM2 process config
│   └── package.json
├── shared/
│   └── architecture-map.js   ← Shared architecture reference
├── infra/
│   ├── aws/
│   │   └── aws-infrastructure.yml  ← AWS CloudFormation/CDK stack
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── nginx-docker.conf
│   └── scripts/
│       ├── deploy.sh
│       ├── monitor.sh
│       └── setup-ssl.sh
├── __tests__/               ← Jest tests (health, config, logger, security)
├── scripts/                 ← Utility scripts
├── docker-compose.yml       ← Local dev orchestration
├── netlify.toml             ← Netlify deployment config
├── next.config.js           ← Next.js config
├── package.json             ← Root monorepo scripts
├── jest.config.js
└── DEPLOYMENT_ARCHITECTURE.md
```

## Module Ownership & Boundaries

| Module | Owner Layer | Responsibilities |
|--------|-------------|------------------|
| `auth` | Backend | Signup, login, Google OAuth, token refresh, logout |
| `users` | Backend | User CRUD, profile updates, wishlist |
| `courses` | Backend | Course/Module/Lesson CRUD, quiz management |
| `enrollments` | Backend | Enrollment lifecycle, lesson progress tracking |
| `payments` | Backend | Stripe + Razorpay integration, webhooks, subscriptions |
| `certificates` | Backend | Certificate generation, verification by number |
| `learning` | Backend | Learning engine, live/recorded classes, notes, progress |
| `assessments` | Backend | Exams, quizzes, assignments |
| `achievements` | Backend | Badges, leaderboard |
| `community` | Backend | Discussions, groups, Q&A (doubts) |
| `events` | Backend | Event CRUD, registrations, paid events |
| `media` | Backend | S3 presigned upload URLs, media records |
| `mentors` | Backend | Mentor profiles (approval flow) |
| `profiles` | Backend | Mentor + Investor profiles (public listing) |
| `admin` | Backend | Admin dashboard data, user management |
| `analytics` | Backend | Learning analytics, article analytics |
| `settings` | Backend | Platform settings |
| `public` | Backend | Public articles, testimonials, featured content |

## Entry Points

| Layer | Entry Point | Port |
|-------|-------------|------|
| Frontend | `apps/web/app/layout.js` → `page.js` | 3000 |
| Backend API | `backend/src/server.js` | 5000 |
| Admin helper | `apps/admin/index.js` | varies |

## Key Dependencies Between Modules

```
payments → enrollments (triggers upsertEnrollment on payment.succeeded)
payments → events (triggers registerForEvent on paid event payment)
enrollments → certificates (completion triggers certificate generation)
courses → enrollments (course must exist before enrollment)
auth → users (user model shared)
learning → enrollments (access gated by enrollment)
assessments → enrollments (access gated by enrollment)
```
