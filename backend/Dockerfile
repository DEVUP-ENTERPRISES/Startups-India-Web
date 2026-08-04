# ──────────────────────────────────────────────────────────────────
# Multi-stage production Dockerfile for Incubation Platform Backend
# Build:  docker build -t incubation-backend .
# Run:    docker run -p 5000:5000 --env-file .env incubation-backend
# ──────────────────────────────────────────────────────────────────

# ─── Stage 1: Install dependencies ───────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Enable pnpm via corepack (bundled with Node)
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

# Copy package files only (better layer caching)
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only, from the frozen lockfile
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

# ─── Stage 2: Production image ──────────────────────────────────
FROM node:20-alpine AS runner

# Security: run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 backend

WORKDIR /app

# Enable pnpm and install PM2 globally
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate && \
    pnpm add -g pm2

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs && chown -R backend:nodejs logs

# Switch to non-root user
USER backend

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

# Start with PM2 in cluster mode (foreground for Docker)
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
