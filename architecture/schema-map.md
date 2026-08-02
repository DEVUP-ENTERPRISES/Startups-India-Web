# Schema Map - MongoDB Data Models

All models use Mongoose. Database: MongoDB.

---

## User
**File:** `backend/src/modules/users/user.model.js`

| Field | Type | Notes |
|-------|------|-------|
| email | String | required, unique, lowercase |
| passwordHash | String | null for OAuth users |
| fullName | String | |
| avatarUrl | String | |
| provider | String | enum: email, google, facebook |
| providerIds.google | String | sparse unique index |
| providerIds.facebook | String | sparse unique index |
| authProviders | [String] | all linked providers |
| role | String | enum: admin, user, mentor, investor |
| headline | String | |
| missionStatement | String | |
| bio | String | |
| city, state, phone | String | |
| socialLinks | Mixed | |
| notificationPrefs | Object | learning, assessments, community, payments, marketing |
| privacySettings | Object | profileVisibility, activityVisibility, showBio, showStats, showGoals |
| isActive | Boolean | default true |
| wishlist | [ObjectId→Course] | |
| refreshTokenHash | String | |
**Indexes:** `{role, createdAt}`, `{providerIds.google}` sparse unique, `{providerIds.facebook}` sparse unique

---

## Course / Module / Lesson
**File:** `backend/src/modules/courses/course.model.js`

### Course
| Field | Type | Notes |
|-------|------|-------|
| slug | String | required, unique |
| title, subtitle, description | String | |
| introCopy, structureDescription | String | |
| durationWeeks, totalModules | Number | |
| category, level, language | String | |
| thumbnailUrl, thumbnailKey | String | |
| videoIntroUrl | String | |
| difficultyLevel | String | beginner/intermediate/advanced |
| isPublished, isFeatured | Boolean | |
| enrollmentStatus | String | open/closed/coming_soon |
| priceInr, originalPriceInr | Number | |
| enrolledCount | Number | |
| startDate, endDate | Date | |
| preStartMessage | String | |
| materials | [{title, fileUrl, fileKey, fileType, size}] | |
**Virtual:** `price` → returns `priceInr`

### Module
| Field | Type | Notes |
|-------|------|-------|
| courseId | ObjectId→Course | required |
| moduleNumber, weekNumber, sortOrder | Number | required |
| title, description | String | |
| whatYouLearn, keyActivities | [String] | |
| deliverable, deliverableDescription | String | |
| durationHours | Number | |
| isLocked, unlockAfterDays | Boolean/Number | drip content |
**Unique index:** `{courseId, sortOrder}`

### Lesson
| Field | Type | Notes |
|-------|------|-------|
| moduleId | ObjectId→Module | required |
| lessonNumber, sortOrder | Number | required |
| title, description | String | |
| contentType | String | video/reading/assignment/quiz/live_session/resource |
| videoUrl, videoKey, videoDurationSeconds | String/Number | |
| readingContent, readingTimeMinutes | String/Number | |
| attachments, externalLinks | [Mixed] | |
| assignmentInstructions, assignmentDeadlineDays | String/Number | |
| quizQuestions | [Mixed] | |
| quizPassingScore | Number | default 75% |
| isPreview, isMandatory | Boolean | |
| durationMinutes | Number | |

---

## Enrollment / LessonProgress / ModuleQuizAttempt
**File:** `backend/src/modules/enrollments/enrollment.model.js`

### Enrollment
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId→User | required |
| courseId | ObjectId→Course | required |
| paymentId | ObjectId→Payment | |
| paymentStatus | String | free/paid/scholarship/pending/completed/failed |
| status | String | enrolled/active/completed/expired/cancelled |
| paymentMethod | String | |
| amountPaid | Number | |
| stripePaymentId | String | |
| progress | Number | 0–100 |
| completed | Boolean | |
| completedAt, lastAccessedAt | Date | |
**Unique index:** `{userId, courseId}`

### LessonProgress
| Field | Type | Notes |
|-------|------|-------|
| userId, courseId, moduleId, lessonId | ObjectId | required |
| lessonTitle | String | |
| isCompleted | Boolean | |
| completedAt | Date | |
**Unique index:** `{userId, courseId, lessonId}`

### ModuleQuizAttempt
| Field | Type | Notes |
|-------|------|-------|
| userId, courseId, moduleId, quizId | ObjectId | required |
| answers | [{questionIndex, selectedOption}] | |
| score, totalQuestions, percentage | Number | |
| passed | Boolean | |

---

## Payment / Subscription
**File:** `backend/src/modules/payments/payment.model.js` + `subscription.model.js`

### Payment
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId→User | required |
| courseId | ObjectId→Course | optional |
| eventId | ObjectId→Event | optional |
| provider | String | stripe/razorpay/manual |
| paymentIntentId | String | Stripe, sparse unique |
| orderId | String | Razorpay, sparse unique |
| paymentId | String | Razorpay transaction, sparse unique |
| amount | Number | required (in INR) |
| currency | String | default INR |
| status | String | created/succeeded/failed/refunded |
| metadata | Mixed | |

### Subscription
Manages recurring subscription records (status, autoRenew, etc.)

---

## Certificate
**File:** `backend/src/modules/certificates/certificate.model.js`

| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId→User | required |
| courseId | ObjectId→Course | required |
| certificateNumber | String | required, unique |
| completionDate | Date | required |
| userName, courseTitle | String | required |
| totalLessonsCompleted, totalQuizzesPassed | Number | |
| overallScore | Number | default 100 |
| isVerified | Boolean | default true |
**Unique index:** `{userId, courseId}`

---

## Article / ArticleAnalytics
**File:** `backend/src/models/Article.js`, `ArticleAnalytics.js`

### Article
| Field | Type | Notes |
|-------|------|-------|
| title, subtitle, slug | String | slug unique |
| author.{name,role,company,profileImage,linkedinUrl,bio} | Object | embedded |
| content | String | Rich HTML (Tiptap) |
| keyPoints | [String] | |
| coverImage, thumbnailImage, videoUrl | String | |
| galleryImages | [String] | |
| category, tags | String/[String] | |
| seo.{metaTitle,metaDescription,keywords,ogImage} | Object | |
| status | String | draft/published/scheduled/unpublished |
| publishedAt, scheduledAt | Date | |
| readTime | Number | minutes |
| isFeatured | Boolean | |
| visibility | String | public/members/admin |
| metrics.{viewsCount,uniqueViews,likesCount,sharesCount,savesCount,avgReadTime,dropOffRate} | Object | |

---

## Event / EventRegistration
**File:** `backend/src/models/Event.js`, `EventRegistration.js`

### Event
| Field | Type | Notes |
|-------|------|-------|
| title, description, category | String | |
| status | String | upcoming/live/completed/cancelled |
| date | Date | |
| maxAttendees | Number | 0 = unlimited |
| registrations | [ObjectId→User] | |
| meetingLink | String | hidden from non-registrants |
| isPaid, price | Boolean/Number | |
| createdBy | ObjectId→User | |

### EventRegistration
Admin-facing record with fullName, email, phoneNumber, paymentStatus, attendanceStatus.

---

## Community: Discussion / Group / Question / Answer
**File:** `backend/src/modules/community/community.model.js`

### Discussion
threadable via parentId (nested replies), reactions (like/upvote/downvote), groupId, pinned/locked

### Group
creator, name (unique), privacy (public/private), tags

### GroupMember
groupId + userId (unique), role (admin/moderator/member), status (active/pending/blocked)

### Question (Doubts)
authorId, title, content, tags, acceptedAnswerId, votes

### Answer
questionId, authorId, content, isAccepted, votes

---

## Achievements: Badge / UserBadge
**File:** `backend/src/modules/achievements/achievements.model.js`

### Badge
type: milestone/score/streak/course, criteria: {metric, value}

### UserBadge
userId + badgeId (unique), earnedAt

---

## Mentor / Investor Profiles
**Files:** `backend/src/modules/profiles/mentor.model.js`, `investor.model.js`

- Mentor: name, bio, expertise, status (pending/approved/rejected), isActive
- Investor: name, bio, investmentFocus, status, isVerified, approvedAt

---

## Shared Models
| Model | File | Purpose |
|-------|------|---------|
| Lead | `models/Lead.js` | Contact/inquiry form submissions |
| Notification | `models/Notification.js` | User notifications |
| Settings | `models/Settings.js` | Platform-wide settings (singleton) |
| Testimonial | `models/Testimonial.js` | Student testimonials |
