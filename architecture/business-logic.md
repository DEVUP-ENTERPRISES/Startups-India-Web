# Business Logic — Startup India Incubation Platform

## Core Business Model
Online incubation/education platform for Indian startups offering:
- Paid courses (startup programs)
- Live + recorded classes
- Mentorship + investor profiles
- Events (free + paid)
- Community (discussions, groups, Q&A)
- Assessments, certificates

---

## Enrollment Workflows

### Free Course Enrollment
```
User → POST /api/v1/enrollments/free
  → Create Enrollment {userId, courseId, paymentStatus: 'free', status: 'enrolled'}
  → User gains access to course content
```

### Paid Course Enrollment (Razorpay)
```
User → POST /api/v1/payments/razorpay/order {courseId, amount}
  → Create Razorpay order → Save Payment {status: 'created'}
  → User pays via Razorpay SDK on frontend
  → POST /api/v1/payments/razorpay/verify {orderId, paymentId, signature}
    → HMAC-SHA256 signature verification
    → Payment updated {status: 'succeeded'}
    → jobQueue.enqueue('payment.succeeded')
    → enrollments.upsertEnrollment {paymentStatus: 'completed'}
  [Fallback] Razorpay webhook → same enrollment flow
```

### Paid Course Enrollment (Stripe)
```
Frontend creates PaymentIntent
  → POST /api/v1/payments/webhook (Stripe webhook)
    → Verify signature → Payment updated
    → jobQueue.enqueue('payment.succeeded')
    → enrollments.upsertEnrollment
```

### Enrollment Idempotency
`upsertEnrollment` uses MongoDB findOneAndUpdate with upsert — safe to call multiple times (webhook + direct verify both call it).

---

## Course Progress & Completion

### Lesson Completion
```
User completes lesson → POST /api/v1/learn/:courseId/lessons/:lessonId/complete
  → LessonProgress created/updated {isCompleted: true, completedAt}
  → Enrollment.progress recalculated (completedLessons / totalLessons * 100)
```

### Course Completion Trigger
```
Enrollment.progress reaches 100
  → Enrollment {completed: true, completedAt, status: 'completed'}
  → Certificate auto-generated (certificateNumber = unique string)
```

### Module Quiz
```
User submits quiz → ModuleQuizAttempt created
  → score, percentage calculated
  → passed = percentage >= quizPassingScore (default 75%)
  → Module unlock gated by quiz pass (if configured)
```

### Drip Content
Lessons in modules with `isLocked: true` unlock after `unlockAfterDays` from enrollment date.

---

## Certificate Lifecycle
```
Auto-generated on course completion
  → certificateNumber = unique identifier
  → Certificate {userId, courseId, certificateNumber, completionDate, userName, courseTitle}
Public verification URL: /verify/:certificateNumber
  → Returns certificate details if isVerified: true
```

---

## Event Registration Rules

### Free Event
```
POST /api/v1/events/:id/register
  → Check maxAttendees (0 = unlimited)
  → Check already registered
  → event.registrations.push(userId)
  → EventRegistration record created
```

### Paid Event
```
Same payment flow as paid course
  → On payment.succeeded → eventsService.registerForEvent()
```

### Meeting Link Access Control
`meetingLink` field is hidden from API response unless user is registered for the event.

---

## Pricing Rules

| Scenario | Logic |
|----------|-------|
| Free course | `priceInr = 0`, directly enrollable |
| Paid course | `priceInr > 0`, requires Stripe or Razorpay payment |
| Display price | Virtual `price` field = `priceInr` |
| Original price | `originalPriceInr` for showing discounts |
| Payment currency | Always INR |
| Razorpay amounts | Stored in INR, converted to paise (×100) for API |

---

## Role-Based Access Rules

| Role | Capabilities |
|------|-------------|
| `user` | Browse courses, enroll, learn, community, events, own profile |
| `mentor` | Same as user + mentor profile visible on mentors page |
| `investor` | Same as user + investor profile on investors page |
| `admin` | Full access: manage courses, users, events, articles, settings, analytics, certificates, enrollments, payments, leads, testimonials |
| `instructor` | Create/edit courses + media upload (subset of admin) |

---

## Approval Flows

### Mentor Application
```
POST /api/v1/profiles/mentors → Mentor created {status: 'pending'}
Admin reviews → PATCH /api/v1/profiles/mentors/:id/status {status: 'approved'/'rejected'}
Approved mentors appear in public /api/v1/profiles/mentors listing
```

### Investor Application
```
POST /api/v1/profiles/investors → Investor created {status: 'pending', isVerified: false}
Admin reviews → PATCH /api/v1/profiles/investors/:id/status
  → isVerified set to true if status = 'approved'
```

---

## Article Publishing States
```
draft → published (manual admin publish)
draft → scheduled (publish at scheduledAt date)
published → unpublished (take offline)
```
Visibility levels: public (all), members (logged-in), admin (admin only).

---

## Achievement / Badge Rules
Badges are awarded based on criteria:
| Badge Type | Metric | Example |
|------------|--------|---------|
| milestone | completionPercentage | First course complete |
| score | averageScore | Score > 90% avg |
| streak | streakDays | 7-day learning streak |
| course | courseId | Specific course completion |

---

## Community Rules
- Discussions support nested replies via `parentId`
- Reactions: like, upvote, downvote per discussion
- Groups: public (anyone can join) or private (invite/pending)
- Doubts Q&A: votes on questions and answers, accepted answer flag
- Group roles: admin > moderator > member

---

## Notification Preferences
User can toggle: learning, assessments, community, payments, marketing.

---

## Privacy Settings
`profileVisibility` / `activityVisibility`: public (everyone), users (logged-in), private (self only).

---

## Rate Limiting Rules
| Endpoint Group | Limit | Window |
|---------------|-------|--------|
| Global (all) | 1000 req | 1 min (in-memory) |
| Global (Redis) | 500 req/IP | 1 min |
| /auth/login | 20 req | 15 min |
| /auth/signup | 20 req | 15 min |
| /auth/forgot-password | 20 req | 15 min |

---

## Maintenance Mode
`MAINTENANCE_MODE` config flag in `apps/web/config/maintenance.js` — renders `MaintenancePage` instead of the homepage when set to `true`.
