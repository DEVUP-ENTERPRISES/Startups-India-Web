#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# Health Monitor - Checks all platform services and alerts on failure
# Usage: ./monitor.sh [--once]   (default: continuous every 30s)
# Add to cron: */1 * * * * /path/to/monitor.sh --once >> /var/log/incubation-monitor.log
# ──────────────────────────────────────────────────────────────────
set -uo pipefail

BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"
ALERT_WEBHOOK="${ALERT_WEBHOOK:-}"  # Slack/Discord webhook URL (optional)
INTERVAL=30
MODE="${1:-loop}"

check_backend() {
  local response
  local http_code
  http_code=$(curl -sf -o /dev/null -w '%{http_code}' "$BACKEND_URL/health" 2>/dev/null || echo "000")

  if [ "$http_code" = "200" ]; then
    echo "[$(date -Iseconds)] ✓ Backend: healthy (HTTP $http_code)"
    return 0
  else
    echo "[$(date -Iseconds)] ✗ Backend: UNHEALTHY (HTTP $http_code)"
    return 1
  fi
}

check_redis() {
  if command -v redis-cli &>/dev/null; then
    if redis-cli ping 2>/dev/null | grep -q "PONG"; then
      echo "[$(date -Iseconds)] ✓ Redis: connected"
      return 0
    else
      echo "[$(date -Iseconds)] ✗ Redis: UNREACHABLE"
      return 1
    fi
  else
    echo "[$(date -Iseconds)] - Redis: redis-cli not available (skipped)"
    return 0
  fi
}

check_disk() {
  local usage
  usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
  if [ "$usage" -gt 90 ]; then
    echo "[$(date -Iseconds)] ✗ Disk: ${usage}% used (CRITICAL)"
    return 1
  elif [ "$usage" -gt 80 ]; then
    echo "[$(date -Iseconds)] ⚠ Disk: ${usage}% used (WARNING)"
    return 0
  else
    echo "[$(date -Iseconds)] ✓ Disk: ${usage}% used"
    return 0
  fi
}

check_memory() {
  if command -v free &>/dev/null; then
    local usage
    usage=$(free | awk '/^Mem:/ {printf "%.0f", ($3/$2)*100}')
    if [ "$usage" -gt 90 ]; then
      echo "[$(date -Iseconds)] ✗ Memory: ${usage}% used (CRITICAL)"
      return 1
    else
      echo "[$(date -Iseconds)] ✓ Memory: ${usage}% used"
      return 0
    fi
  fi
  return 0
}

check_pm2() {
  if command -v pm2 &>/dev/null; then
    local errored
    errored=$(pm2 jlist 2>/dev/null | grep -c '"status":"errored"' || echo "0")
    local online
    online=$(pm2 jlist 2>/dev/null | grep -c '"status":"online"' || echo "0")
    if [ "$errored" -gt 0 ]; then
      echo "[$(date -Iseconds)] ✗ PM2: $errored workers errored, $online online"
      return 1
    elif [ "$online" -gt 0 ]; then
      echo "[$(date -Iseconds)] ✓ PM2: $online workers online"
      return 0
    else
      echo "[$(date -Iseconds)] ✗ PM2: no workers running"
      return 1
    fi
  fi
  return 0
}

send_alert() {
  local message="$1"
  if [ -n "$ALERT_WEBHOOK" ]; then
    curl -sf -X POST -H 'Content-Type: application/json' \
      -d "{\"text\":\"🚨 Incubation Platform Alert: $message\"}" \
      "$ALERT_WEBHOOK" >/dev/null 2>&1 || true
  fi
}

run_checks() {
  local failed=0
  echo "────────────────────────────────────────────────────"

  check_backend  || { failed=$((failed + 1)); send_alert "Backend health check failed"; }
  check_redis    || { failed=$((failed + 1)); send_alert "Redis unreachable"; }
  check_pm2      || { failed=$((failed + 1)); send_alert "PM2 workers unhealthy"; }
  check_disk     || { failed=$((failed + 1)); send_alert "Disk usage critical"; }
  check_memory   || { failed=$((failed + 1)); send_alert "Memory usage critical"; }

  if [ "$failed" -eq 0 ]; then
    echo "[$(date -Iseconds)] ═ All checks passed"
  else
    echo "[$(date -Iseconds)] ═ $failed check(s) FAILED"
  fi
}

if [ "$MODE" = "--once" ]; then
  run_checks
else
  echo "Monitoring loop (every ${INTERVAL}s). Ctrl+C to stop."
  while true; do
    run_checks
    sleep "$INTERVAL"
  done
fi
