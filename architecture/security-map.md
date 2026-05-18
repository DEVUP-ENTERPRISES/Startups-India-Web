# Security Map — Startup India Incubation Platform

## Authentication

### JWT Strategy
- **Access Token:** 15 minutes TTL, signed with `JWT_ACCESS_SECRET`
  - Payload: `{ sub: userId, role, email }`
- **Refresh Token:** 30 days TTL, signed with `JWT_REFRESH_SECRET`
  - Payload: `{ sub: userId }`
- Token delivery: Bearer header (`Authorization: Bearer <token>`) OR `accessToken` httpOnly cookie

### Token Verification Flow
```
authMiddleware.js:
  1. Check Authorization header for Bearer token
  2. Fall back to req.cookies.accessToken
  3. Verify via utils/token.js → jwt.verify()
  4. Attach req.user = { userId, role, email }
```

### OAuth
- **Google OAuth 2.0:** ID token verified server-side via `google-auth-library` OAuth2Client
  - If user doesn't exist → auto-create with provider: 'google'
  - If user exists → link Google ID to existing account
- **Facebook:** Stub — returns 501 Not Implemented

### Password Handling
- bcryptjs with salt rounds = 10
- `passwordHash` stored in User document
- `refreshTokenHash` field exists (but refresh validation uses jwt.verify not hash comparison — note: no token rotation)

---

## Authorization

### Middleware Chain
```javascript
authRequired      // 401 if no valid token
  ↓
requireRole('admin', 'instructor')  // 403 if wrong role
```

### Role Enum
`admin` > `instructor` (implicit) > `mentor` > `investor` > `user`

### Route-Level Access
| Access Level | Middleware Used |
|-------------|----------------|
| Public | none |
| Logged-in user | `authRequired` |
| Specific roles | `authRequired` + `requireRole(...)` |
| Admin only | `authRequired` + `requireRole('admin')` |
| Admin or Instructor | `authRequired` + `requireRole('admin', 'instructor')` |
| Optional auth | `optionalAuth` (attaches user if token present, doesn't block) |

---

## Security Headers (Helmet)

```javascript
helmet({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://accounts.google.com'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://accounts.google.com', 'https://oauth2.googleapis.com'],
    frameSrc: ["'self'", 'https://accounts.google.com'],
    objectSrc: ["'none'"],
  },
  crossOriginEmbedderPolicy: false,      // For S3 video embeds
  crossOriginOpenerPolicy: 'same-origin-allow-popups',  // Google OAuth popup
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true }  // 2 years HSTS
})
```

- `X-Powered-By` disabled
- `Cache-Control: no-store` on all API responses

---

## CORS Policy

**Allowed Origins (strict in production):**
- `https://learning-startups-india.vercel.app`
- `https://startupsindia.in`
- `https://www.startupsindia.in`
- `http://localhost:3000`
- `http://localhost:8080`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:8080`

Non-whitelisted origins → 403 in production, allowed in development.

---

## Rate Limiting

| Layer | Implementation | Limit |
|-------|---------------|-------|
| In-memory | `express-rate-limit` | 1000 req/min global |
| Redis-backed | `redisRateLimit` middleware | 500 req/min per IP |
| Auth endpoints | `express-rate-limit` | 20 req / 15 min |

Redis rate limiter gracefully falls back to in-memory if Redis is unavailable.

---

## Payment Security

### Razorpay
- Signature verification: HMAC-SHA256 of `{orderId}|{paymentId}` against `RAZORPAY_KEY_SECRET`
- Webhook verification: HMAC-SHA256 of raw body against `RAZORPAY_WEBHOOK_SECRET`
- Raw body preserved for webhook: `express.raw({ type: 'application/json' })` on webhook routes

### Stripe
- Webhook verification: `stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)`
- Raw body preserved for webhook routes

---

## Input Validation & Sanitization

- `validateBody.js` middleware for schema validation
- `sanitizer.js` utility for XSS/HTML sanitization
- Parameter pollution prevention: array query params deduplicated to last value
- JSON body limit: 1MB

---

## Sensitive Data Handling

| Data | Handling |
|------|---------|
| Passwords | bcrypt hashed, never returned |
| JWT secrets | env vars only, never hardcoded |
| Stripe/Razorpay keys | env vars only |
| AWS keys | env vars only |
| Meeting links | Hidden from API response unless user is registered for event |
| `refreshTokenHash` | Stored but currently jwt.verify() used for validation |

---

## Environment Variables Required

```
MONGODB_URI            # Required — MongoDB connection string
JWT_ACCESS_SECRET      # Required — JWT signing secret
JWT_REFRESH_SECRET     # Required — JWT refresh signing secret
JWT_ACCESS_EXPIRES_IN  # Optional — default 15m
JWT_REFRESH_EXPIRES_IN # Optional — default 30d
STRIPE_SECRET_KEY      # Optional — Stripe payments
STRIPE_WEBHOOK_SECRET  # Optional — Stripe webhook validation
RAZORPAY_KEY_ID        # Optional — Razorpay payments
RAZORPAY_KEY_SECRET    # Optional — Razorpay signature verification
RAZORPAY_WEBHOOK_SECRET# Optional — Razorpay webhook validation
GOOGLE_CLIENT_ID       # Optional — Google OAuth
AWS_ACCESS_KEY_ID      # Optional — S3 media uploads
AWS_SECRET_ACCESS_KEY  # Optional — S3 media uploads
AWS_S3_BUCKET          # Optional — S3 bucket name
AWS_REGION             # Optional — default ap-south-1
REDIS_URL              # Optional — default redis://127.0.0.1:6379
ADMIN_EMAIL            # Optional — seeded admin account
ADMIN_PASSWORD         # Optional — seeded admin password
```

---

## Security Risks (See gaps-and-risks.md)

1. No refresh token rotation — stolen refresh token valid for 30 days
2. `passwordHash` duplicate `wishlist` field in user schema (schema bug)
3. Facebook login stub throws 501 but could mislead users
4. No CSRF protection on cookie-based auth
