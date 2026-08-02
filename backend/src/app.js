const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
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

// Trust nginx/load-balancer proxy on EC2 (fixes X-Forwarded-For + rate-limit)
app.set('trust proxy', 1);

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

// Trust first proxy for correct client IPs (if behind a proxy)
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
  if (req.body && typeof req.body === 'object') {
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
      redis: isRedisReady() ? 'connected' : 'disconnected',
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
app.use('/api/v1/auth/refresh', authLimiter);

// Every OTP send costs real money and rings a real phone, so these are capped
// harder than the rest of auth. The per-user/per-challenge caps live in the
// service; this is the coarse per-IP net in front of them.
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many code requests, please try again later' },
});
app.use('/api/v1/auth/2fa', otpLimiter);
app.use('/api/v1/auth/phone', otpLimiter);

// Stricter rate limit for admin panel - 120 req/min per IP
app.use(
  '/api/v1/admin',
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many admin requests, please slow down' },
  })
);

registerRoutes(app);
app.use(errorMiddleware);

module.exports = { app };
