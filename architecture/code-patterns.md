# Code Patterns — Startup India Incubation Platform

## Backend Patterns

### Module Structure (Domain-Driven)
Every backend feature follows the same 4-file pattern:
```
modules/<domain>/
  <domain>.model.js      ← Mongoose schema + model exports
  <domain>.service.js    ← Business logic (pure functions, no req/res)
  <domain>.controller.js ← Express handlers (call service, send response)
  <domain>.routes.js     ← Route definitions (apply middleware, mount controller)
```
**Example:** `modules/courses/course.model.js`, `courses.service.js`, `courses.controller.js`, `courses.routes.js`

---

### Controller Pattern
```javascript
// asyncHandler wraps async functions — catches errors and passes to errorMiddleware
const { asyncHandler } = require('../../utils/asyncHandler');

router.get('/endpoint', authRequired, asyncHandler(async (req, res) => {
  const data = await service.someMethod(req.user.userId, req.params);
  res.json({ success: true, data });
}));
```

### Error Handling Pattern
```javascript
// Throw ApiError in service layer
throw new ApiError(404, 'Course not found');
throw new ApiError(403, 'Insufficient permissions');

// errorMiddleware in app.js catches all errors and formats them
// { success: false, message: '...', statusCode: 404 }
```

### Response Format
```javascript
// Success
res.json({ success: true, data: { ... } });
res.json({ success: true, data: [...], total, page, pages });

// Error (via errorMiddleware)
{ success: false, message: 'Error description', statusCode: 4xx/5xx }
```

### Cache Pattern (Get-or-Set)
```javascript
const result = await cacheGetOrSet(
  `key:${id}`,      // cache key
  300,              // TTL seconds
  async () => {     // compute function (DB call)
    return Model.findById(id).lean();
  }
);
```

### Cache Invalidation
```javascript
// After mutation, invalidate relevant cache keys
await cacheDel(`course:${courseId}`, `courses:list`);
await cacheFlushPattern(`user:${userId}:*`);
```

### Async Job Pattern
```javascript
// Register a job handler
jobQueue.register('payment.succeeded', async (payload) => {
  await enrollmentsService.upsertEnrollment(...);
});

// Enqueue a job
jobQueue.enqueue('payment.succeeded', { paymentId, ... });
```

---

## Frontend Patterns

### Next.js App Router
- All pages in `apps/web/app/` directory
- File-based routing — folder = route segment, `page.js` = route handler
- `layout.js` files for shared layouts
- `(auth)` group folder for auth-specific layout (no Navbar/Footer)
- Dynamic routes: `[slug]`, `[id]`, `[courseId]`, `[certificateNumber]`

### Component Structure
```
apps/web/
  components/          ← Reusable React components
  app/<route>/page.js  ← Page components (route handlers)
  styles/              ← CSS files (per-page or shared)
  lib/                 ← API client utilities, helpers
  hooks/               ← Custom React hooks
  config/              ← App config (maintenance, etc.)
```

### CSS Architecture (Layered Loading Order)
```
1. reset.css           ← Browser normalization
2. tokens.css          ← Design tokens (CSS variables)
3. globals.css         ← Base typography, layout
4. design-system.css   ← Component system variables
5. home-enterprise.css ← Enterprise responsive framework
6. header.css / footer.css ← Shared layout components
7. responsive-overrides.css ← Global responsive (last, highest specificity)
8. [page-specific].css ← Imported per-page for code splitting
```

### ConditionalLayout Pattern
`ConditionalLayout` component conditionally renders Navbar/Footer based on route. Admin routes and auth routes get different or no layout wrappers.

### Animation Pattern
Framer Motion used for section entrance animations:
```javascript
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={sectionVariants}
>
  <Section />
</motion.div>
```

---

## Shared Patterns

### Environment Variables
- Backend: `backend/src/config/env.js` — validates required vars at startup
- Frontend: `.env.local` / `.env.prod` — Next.js env vars (`NEXT_PUBLIC_*` for client)

### Validation
- `validateBody.js` middleware validates request body schema before controller
- `sanitizer.js` for HTML/XSS sanitization of user input

### Database Queries
- Always use `.lean()` for read-only queries (returns plain JS objects, faster)
- Use `findOneAndUpdate` with `{ new: true }` for atomic upserts
- Pagination: `skip((page-1)*limit).limit(limit)` with `countDocuments` for total

### Index Strategy
- Every foreign key has an index
- Compound unique indexes for relationship uniqueness (userId+courseId in Enrollment)
- Sparse indexes for optional unique fields (providerIds.google)

### Logging
```javascript
const { logger } = require('../infrastructure/observability/logger');
logger.info('message', { key: value });
logger.warn('message', { key: value });
logger.error('message', { key: value });
```

### Security Middleware Chain
Every sensitive route: `authRequired` → `requireRole(...)` → `cacheMiddleware(...)` → `asyncHandler(controller)`
