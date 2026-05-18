# API Map — Backend REST API (Base: /api/v1)

All routes are Express-based. Auth uses JWT Bearer token or `accessToken` cookie.

## Auth — `/api/v1/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | Public | Create account (email+password) |
| POST | `/login` | Public | Login with email+password → tokens |
| POST | `/google` | Public | Google OAuth login/signup |
| POST | `/refresh` | Public | Refresh access token via refresh token |
| POST | `/logout` | authRequired | Logout (client-side token deletion) |
| POST | `/forgot-password` | Public | Send password reset email |

Rate limited: 20 req / 15 min on login, signup, forgot-password.

---

## Users — `/api/v1/users`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/me` | authRequired | Get own profile |
| PATCH | `/me` | authRequired | Update profile (name, bio, city, etc.) |
| GET | `/me/wishlist` | authRequired | Get wishlist course IDs |
| POST | `/me/wishlist` | authRequired | Add course to wishlist |
| DELETE | `/me/wishlist/:courseId` | authRequired | Remove from wishlist |
| GET | `/` | admin | List all users |
| GET | `/:id` | admin | Get user by ID |
| PATCH | `/:id` | admin | Update user |
| DELETE | `/:id` | admin | Delete user |

---

## Courses — `/api/v1/courses`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List published courses |
| GET | `/:slug` | optionalAuth | Course details by slug |
| POST | `/` | admin/instructor | Create course |
| PUT | `/:id` | admin/instructor | Update course |
| DELETE | `/:id` | admin | Delete course |
| GET | `/:courseId/modules` | authRequired | List modules |
| POST | `/:courseId/modules` | admin/instructor | Create module |
| GET | `/:courseId/modules/:moduleId/lessons` | authRequired | List lessons |
| POST | `/:courseId/modules/:moduleId/lessons` | admin/instructor | Create lesson |

---

## Enrollments — `/api/v1/enrollments`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | authRequired | Get own enrollments |
| POST | `/free` | authRequired | Enroll in free course |
| GET | `/:courseId/progress` | authRequired | Get progress for course |
| PATCH | `/:enrollmentId` | admin | Admin update enrollment |

---

## Payments — `/api/v1/payments`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | authRequired | List own payments |
| POST | `/` | authRequired | Create payment record |
| POST | `/razorpay/order` | authRequired | Create Razorpay order |
| POST | `/razorpay/verify` | authRequired | Verify Razorpay signature + enroll |
| POST | `/webhook` | Public (Stripe) | Stripe webhook handler |
| POST | `/razorpay/webhook` | Public (Razorpay) | Razorpay webhook handler |
| POST | `/verify-intent` | authRequired | Verify Stripe payment intent |
| GET | `/purchases` | authRequired | List successful purchases |
| GET | `/billing` | authRequired | Billing history |
| GET | `/subscriptions` | authRequired | List subscriptions |
| DELETE | `/subscriptions/:id` | authRequired | Cancel subscription |

---

## Learning — `/api/v1/learning`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | authRequired | Get learning overview |
| GET | `/progress` | authRequired | Get progress data |
| POST | `/progress` | authRequired | Update lesson progress |
| GET | `/live` | authRequired | List live classes |
| GET | `/recorded` | authRequired | List recorded classes |
| GET | `/notes` | authRequired | Get notes |
| POST | `/notes` | authRequired | Create note |

### Learning Engine — `/api/v1/learn`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:courseId` | authRequired (enrolled) | Full course learning view |
| GET | `/:courseId/lessons/:lessonId` | authRequired (enrolled) | Lesson content |
| POST | `/:courseId/lessons/:lessonId/complete` | authRequired (enrolled) | Mark lesson complete |

---

## Certificates — `/api/v1/certificates`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | authRequired | List own certificates |
| GET | `/:id` | authRequired | Get certificate by ID |
| POST | `/generate/:enrollmentId` | authRequired | Generate certificate |
| GET | `/verify/:certificateNumber` | Public | Verify certificate (public URL) |

---

## Assessments — `/api/v1/assessments`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | authRequired | List assessments |
| GET | `/exams` | authRequired | List exams |
| GET | `/exams/:id` | authRequired | Exam details |
| POST | `/exams/:id/attempt` | authRequired | Submit exam attempt |
| GET | `/quizzes` | authRequired | List quizzes |
| POST | `/quizzes/:id/attempt` | authRequired | Submit quiz attempt |
| GET | `/assignments` | authRequired | List assignments |
| POST | `/assignments/:id/submit` | authRequired | Submit assignment |

---

## Achievements — `/api/v1/achievements`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | authRequired | Get own badges/achievements |
| GET | `/badges` | authRequired | List all available badges |
| GET | `/leaderboard` | authRequired | Get leaderboard |

---

## Community — `/api/v1/community`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/discussions` | authRequired | List discussions |
| POST | `/discussions` | authRequired | Create discussion |
| GET | `/groups` | authRequired | List groups |
| POST | `/groups` | authRequired | Create group |
| POST | `/groups/:id/join` | authRequired | Join group |
| GET | `/doubts` | authRequired | List Q&A questions |
| POST | `/doubts` | authRequired | Post a question |
| POST | `/doubts/:id/answers` | authRequired | Answer a question |

---

## Events — `/api/v1/events`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List events (paginated) |
| GET | `/featured` | Public | Featured/upcoming events |
| GET | `/:id` | optionalAuth | Event details (hides meetingLink if not registered) |
| POST | `/` | admin | Create event |
| PUT | `/:id` | admin | Update event |
| DELETE | `/:id` | admin | Delete event |
| POST | `/:id/register` | authRequired | Register for event |
| DELETE | `/:id/register` | authRequired | Unregister from event |
| GET | `/my` | authRequired | Get user's registered events |

---

## Articles (Public Blog) — `/api/v1/articles`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List published articles |
| GET | `/:slug` | Public | Article by slug |
| POST | `/` | admin | Create article |
| PUT | `/:id` | admin | Update article |
| DELETE | `/:id` | admin | Delete article |
| POST | `/:id/view` | Public | Track article view |
| GET | `/:id/analytics` | admin | Article analytics |

---

## Profiles (Mentors/Investors) — `/api/v1/profiles`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/mentors` | Public | List approved mentors |
| POST | `/mentors` | authRequired | Apply as mentor |
| GET | `/investors` | Public | List approved investors |
| POST | `/investors` | authRequired | Apply as investor |
| PATCH | `/mentors/:id/status` | admin | Approve/reject mentor |
| PATCH | `/investors/:id/status` | admin | Approve/reject investor |

---

## Admin — `/api/v1/admin`
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/dashboard` | authRequired | admin |
| GET | `/users` | authRequired | admin |
| GET | `/courses` | authRequired | admin |
| GET | `/enrollments` | authRequired | admin |
| GET | `/payments` | authRequired | admin |
| GET | `/leads` | authRequired | admin |
| GET | `/settings` | authRequired | admin |
| PATCH | `/settings` | authRequired | admin |

---

## Analytics — `/api/v1/analytics`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/learning` | authRequired | Learning time stats |
| GET | `/performance` | authRequired | Score/performance stats |
| GET | `/progress` | authRequired | Progress analytics |
| GET | `/skills` | authRequired | Skills analytics |

---

## Media — `/api/v1/media`
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/upload-url` | authRequired | admin/instructor — S3 presigned URL |
| POST | `/complete` | authRequired | admin/instructor — Confirm S3 upload |

Also available at `/api/v1/upload-url` and `/api/v1/upload-complete` (aliases).

---

## Settings — `/api/v1/settings`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | authRequired | Get platform settings |
| PATCH | `/` | admin | Update settings |

---

## Public — `/api/v1/public`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/featured` | Public | Featured courses, events, articles |
| GET | `/testimonials` | Public | Testimonials |
| POST | `/leads` | Public | Submit lead (contact/inquiry) |

---

## Health & Metrics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | Public | System health (DB, Redis, memory) |
| GET | `/metrics` | Public | Metrics snapshot |
| GET | `/api/v1/activity` | authRequired | Own activity feed |

---

## Utility Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/verify/:certificateNumber` | Public | Certificate verification (frontend route too) |
