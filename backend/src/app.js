const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const env = require('./config/env');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const { registerRoutes } = require('./routes');
const { metricsMiddleware, getMetricsSnapshot } = require('./infrastructure/observability/metrics');
const { redisRateLimit } = require('./middlewares/rateLimit.middleware');
const { getCacheStats, isRedisReady } = require('./infrastructure/cache/redis');
const { stripMongoOperators } = require('./utils/sanitizer');
const mongoose = require('mongoose');

const app = express();

// ─── SECURITY HARDENING ──────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://accounts.google.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://accounts.google.com', 'https://oauth2.googleapis.com'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'", 'https://accounts.google.com'],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow cross-origin resources (S3 videos)
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Allow Google OAuth popups
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow CORS preflight responses
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  })
);

// Prevent parameter pollution
app.use((req, res, next) => {
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (Array.isArray(req.query[key])) {
        req.query[key] = req.query[key][req.query[key].length - 1];
      }
    }
  }
  next();
});

// One hop (nginx on EC2) so req.ip and rate limits see the real client address.
app.set('trust proxy', env.NODE_ENV === 'production' ? 1 : false);

const allowedOrigins = [
  'https://learning-startups-india.vercel.app',
  'https://startupsindia.in',
  'https://www.startupsindia.in',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman / mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        // Allow all in dev, strict in production
        if (process.env.NODE_ENV === 'production') {
          return callback(new Error('Not allowed by CORS'));
        }
        return callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    maxAge: 86400,
  })
);

app.disable('x-powered-by');

// Production nginx does not gzip JSON, so compress here; responses under 1 KB are not worth the CPU.
app.use(compression({ threshold: 1024 }));

app.use(cookieParser());
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.removeHeader('X-Powered-By');
  next();
});
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use('/api/v1/payments/razorpay/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Strip MongoDB operator keys ($gt, $where, etc.) from request bodies to prevent NoSQL injection
app.use((req, res, next) => {
  // Webhook bodies are raw Buffers; rebuilding one as an object destroys the bytes the HMAC covers.
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    req.body = stripMongoOperators(req.body);
  }
  next();
});
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(metricsMiddleware);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: env.NODE_ENV === 'production' ? 1000 : 1000000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Redis-backed rate limiter (100 req/min per IP, graceful fallback to in-memory above)
app.use(redisRateLimit({ windowSeconds: 60, max: 500, prefix: 'rl:global' }));

// Internal-only health check - public response is minimal; full details require internal token
app.get('/health', (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const ok = mongoState === 1;

  const internalToken = req.headers['x-internal-token'];
  const isInternal = internalToken && internalToken === env.INTERNAL_API_KEY;

  if (isInternal) {
    const mongoStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoState] || 'unknown';
    return res.json({
      status: ok ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      worker: process.env.pm_id || 'standalone',
      pid: process.pid,
      memory: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
        heap: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      },
      mongo: mongoStatus,
      redis: isRedisReady() ? 'connected' : 'disconnected (in-memory cache fallback)',
      configProblems: env.CONFIG_PROBLEMS || [],
      cache: getCacheStats(),
    });
  }

  // Public: status only
  res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'degraded' });
});

// Metrics endpoint restricted to internal consumers
app.get('/metrics', (req, res) => {
  const internalToken = req.headers['x-internal-token'];
  if (!internalToken || internalToken !== env.INTERNAL_API_KEY) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  res.json({ success: true, data: getMetricsSnapshot() });
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

// Apply ONLY to sensitive routes
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/signup', authLimiter);
app.use('/api/v1/auth/forgot-password', authLimiter);
// Caps brute-forcing of reset tokens. The token is 256-bit so guessing is
// hopeless anyway, but this keeps the attempt cheap to absorb.
app.use('/api/v1/auth/reset-password', authLimiter);
// Refresh needs a signed token (nothing to brute-force), and campus NAT puts many users behind one IP.
app.use(
  '/api/v1/auth/refresh',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts, please try again later' },
  })
);

// Every OTP send costs real money and rings a real phone, so these are capped
// harder than the rest of auth. The per-user/per-challenge caps live in the
// service; this is the coarse per-IP net in front of them.
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'production' ? 10 : 100, // relaxed in dev for testing
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many code requests, please try again later' },
});
app.use('/api/v1/auth/2fa', otpLimiter);
app.use('/api/v1/auth/phone', otpLimiter);

// Stricter rate limit for admin panel - 120 req/min per IP
app.use(
  [`/api/v1/${env.ADMIN_SLUG}`, '/api/v1/crm'],
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many admin requests, please slow down' },
  })
);

// Without MongoDB, fail fast with 503 (Razorpay retries webhooks on it) rather than hang until buffer timeout.
app.use('/api', (req, res, next) => {
  if (!app.locals.requireDatabase || mongoose.connection.readyState === 1) return next();
  res.setHeader('Retry-After', '10');
  return res.status(503).json({ success: false, message: 'Service temporarily unavailable, please retry shortly.' });
});

registerRoutes(app);
app.use(errorMiddleware);

module.exports = { app };
