# System Design — Startup India Incubation Platform

## Architecture Overview

```
                         ┌─────────────────────┐
                         │   User's Browser     │
                         └────────┬────────────┘
                                  │ HTTPS
                         ┌────────▼────────────┐
                         │   Nginx (Reverse     │
                         │   Proxy / SSL)        │
                         └────────┬────────────┘
               ┌──────────────────┼──────────────────┐
               │                  │                   │
      ┌────────▼────────┐ ┌──────▼──────┐   ┌───────▼───────┐
      │  Next.js 14 App  │ │ Express API │   │  Admin Panel  │
      │  (apps/web)      │ │ (backend)   │   │  (apps/admin) │
      │  Port 3000       │ │ Port 5000   │   │               │
      └────────┬────────┘ └──────┬──────┘   └───────────────┘
               │                 │
               │  REST API calls  │
               │  /api/v1/*       │
               └─────────────────┤
                                  │
                    ┌─────────────▼─────────────┐
                    │       MongoDB              │
                    │  (Primary Data Store)      │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │       Redis                │
                    │  (Cache + Rate Limiting)   │
                    └───────────────────────────┘
```

## Request Lifecycle (Backend)

```
HTTP Request
  → Nginx (SSL termination, proxy)
  → Express app.js
    → Helmet (security headers: CSP, HSTS, etc.)
    → Parameter pollution prevention
    → CORS (whitelist: vercel.app, startupsindia.in, localhost)
    → Cookie parser
    → Request ID injection (X-Request-Id)
    → Raw body parser (webhook routes only)
    → JSON body parser (1MB limit)
    → Morgan logger
    → Metrics middleware (observability)
    → Global rate limiter (1000 req/min in-memory)
    → Redis rate limiter (500 req/min, per-IP, graceful fallback)
    → Auth-specific limiter on /auth/login, /auth/signup (20 req/15min)
  → Route handler
    → authMiddleware (optional or required)
    → requireRole (if role-gated)
    → cacheMiddleware (if cached route)
    → Controller → Service → Model → MongoDB
    → Response
  → errorMiddleware (catches ApiError, unhandled errors)
```

## Request Lifecycle (Frontend)

```
Browser
  → Next.js App Router
  → RootLayout (layout.js)
    → ClientErrorBoundary
    → ConditionalLayout (injects Navbar/Footer based on route)
      → Page Component
        → API calls to /api/v1/* (backend)
        → Auth state from localStorage / cookies
```

## Data Lifecycle

```
User Sign Up
  → User created in MongoDB (User collection)
  → JWT access token (15m) + refresh token (30d) issued

Course Purchase (Razorpay)
  → Create Razorpay order → Payment record (status: created)
  → User pays → verifyRazorpayPayment called
  → Signature verified → Payment updated (status: succeeded)
  → jobQueue.enqueue('payment.succeeded')
  → job handler → upsertEnrollment (Enrollment record created/updated)

Course Purchase (Stripe)
  → Stripe PaymentIntent created on frontend
  → Webhook received → Payment updated (status: succeeded)
  → jobQueue.enqueue('payment.succeeded')
  → job handler → upsertEnrollment

Course Progress
  → User watches lesson → POST /api/v1/learning/progress
  → LessonProgress record created
  → Enrollment.progress % recalculated
  → On 100% → Certificate auto-generated

Event Registration (Free)
  → POST /api/v1/events/:id/register
  → event.registrations[] updated
  → EventRegistration record created

Event Registration (Paid)
  → Payment flow (same as course)
  → On payment.succeeded → eventsService.registerForEvent()
```

## Service Interactions

```
payments.service
  ├── calls enrollments.service.upsertEnrollment (on payment success)
  ├── calls events.service.registerForEvent (on paid event payment)
  └── uses jobQueue for async enrollment after webhook

enrollments.service
  ├── calls certificates.service (on 100% completion)
  └── manages LessonProgress + ModuleQuizAttempt

auth.service
  └── uses bcrypt (password hash), jsonwebtoken (tokens), google-auth-library (OAuth)

media.service
  └── uses AWS S3 presigned URLs for direct-to-S3 uploads

email service (utils/emailService.js)
  └── SMTP/sendgrid for transactional emails
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS 4, Framer Motion 12 |
| Backend | Node.js, Express 4, PM2 (process manager) |
| Database | MongoDB (via Mongoose 8) |
| Cache | Redis 7 (optional, graceful fallback) |
| Auth | JWT (access 15m, refresh 30d), Google OAuth2 |
| Payments | Stripe + Razorpay (dual provider) |
| Storage | AWS S3 (media, course materials) |
| Deployment | Vercel (frontend), Docker + Nginx (backend) |
| Monitoring | Custom metrics middleware, Winston logger |
| Testing | Jest, React Testing Library |
