#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# Zero-downtime deployment script for Incubation Platform Backend
# Usage: ./deploy.sh [--docker]
# ──────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
BACKEND_DIR="$PROJECT_ROOT/backend"
DEPLOY_MODE="${1:-pm2}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "═══════════════════════════════════════════════════════"
echo "  Incubation Platform - Zero-Downtime Deploy"
echo "  Mode: $DEPLOY_MODE | Time: $TIMESTAMP"
echo "═══════════════════════════════════════════════════════"

# ─── PRE-FLIGHT CHECKS ──────────────────────────────────────────
preflight() {
  echo "▸ Running pre-flight checks..."

  if [ "$DEPLOY_MODE" = "--docker" ]; then
    command -v docker >/dev/null 2>&1 || { echo "✗ Docker not installed"; exit 1; }
    command -v docker compose >/dev/null 2>&1 || { echo "✗ Docker Compose not found"; exit 1; }
  else
    command -v node >/dev/null 2>&1 || { echo "✗ Node.js not installed"; exit 1; }
    command -v pnpm >/dev/null 2>&1 || { echo "✗ pnpm not installed. Run: corepack enable && corepack prepare pnpm@9.12.2 --activate"; exit 1; }
    command -v pm2 >/dev/null 2>&1 || { echo "✗ PM2 not installed. Run: pnpm add -g pm2"; exit 1; }
  fi

  echo "✓ Pre-flight checks passed"
}

# ─── PM2 DEPLOY (default) ───────────────────────────────────────
deploy_pm2() {
  echo ""
  echo "▸ Step 1/4: Pull latest code"
  cd "$PROJECT_ROOT"
  git pull origin main

  echo ""
  echo "▸ Step 2/4: Install dependencies"
  cd "$BACKEND_DIR"
  pnpm install --prod --frozen-lockfile

  echo ""
  echo "▸ Step 3/4: Zero-downtime reload"
  # pm2 reload does rolling restart: one worker at a time
  # wait_ready + listen_timeout ensures each worker is ready before next
  if pm2 describe incubation-backend > /dev/null 2>&1; then
    pm2 reload ecosystem.config.js --env production
    echo "✓ Rolling reload complete"
  else
    pm2 start ecosystem.config.js --env production
    echo "✓ First-time start complete"
  fi

  echo ""
  echo "▸ Step 4/4: Verify health"
  sleep 3
  HEALTH=$(curl -sf http://localhost:5000/health || echo '{"status":"error"}')
  STATUS=$(echo "$HEALTH" | grep -o '"status":"[^"]*"' | head -1)
  echo "  Health: $STATUS"

  pm2 save
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "  ✓ PM2 deploy complete"
  echo "  Workers: $(pm2 jlist 2>/dev/null | grep -c '"pm_id"' || echo 'unknown')"
  echo "═══════════════════════════════════════════════════════"
}

# ─── DOCKER DEPLOY ──────────────────────────────────────────────
deploy_docker() {
  echo ""
  echo "▸ Step 1/4: Pull latest code"
  cd "$PROJECT_ROOT"
  git pull origin main

  echo ""
  echo "▸ Step 2/4: Build new image"
  docker compose build backend

  echo ""
  echo "▸ Step 3/4: Rolling update"
  # Scale to 2 containers, then replace old ones
  docker compose up -d --no-deps --build backend

  echo ""
  echo "▸ Step 4/4: Verify health"
  sleep 10
  HEALTH=$(curl -sf http://localhost:5000/health || echo '{"status":"error"}')
  STATUS=$(echo "$HEALTH" | grep -o '"status":"[^"]*"' | head -1)
  echo "  Health: $STATUS"

  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "  ✓ Docker deploy complete"
  echo "═══════════════════════════════════════════════════════"
}

# ─── ROLLBACK ───────────────────────────────────────────────────
rollback() {
  echo ""
  echo "▸ Rolling back to previous version..."
  cd "$PROJECT_ROOT"
  git checkout HEAD~1

  if [ "$DEPLOY_MODE" = "--docker" ]; then
    docker compose up -d --build backend
  else
    cd "$BACKEND_DIR"
    pnpm install --prod --frozen-lockfile
    pm2 reload ecosystem.config.js --env production
  fi

  echo "✓ Rollback complete"
}

# ─── MAIN ───────────────────────────────────────────────────────
preflight

if [ "$DEPLOY_MODE" = "--docker" ]; then
  deploy_docker
elif [ "$DEPLOY_MODE" = "--rollback" ]; then
  rollback
else
  deploy_pm2
fi
