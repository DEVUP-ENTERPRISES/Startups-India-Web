#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# Let's Encrypt SSL Setup + Auto-Renewal for Incubation Platform
# Usage: sudo ./setup-ssl.sh yourdomain.com admin@yourdomain.com
# ──────────────────────────────────────────────────────────────────
set -euo pipefail

DOMAIN="${1:?Usage: ./setup-ssl.sh <domain> <email>}"
EMAIL="${2:?Usage: ./setup-ssl.sh <domain> <email>}"

echo "═══════════════════════════════════════════════════════"
echo "  SSL Setup - $DOMAIN"
echo "═══════════════════════════════════════════════════════"

# ─── INSTALL CERTBOT ────────────────────────────────────────────
if ! command -v certbot &>/dev/null; then
  echo "▸ Installing Certbot..."
  apt-get update -qq
  apt-get install -y certbot python3-certbot-nginx
fi

# ─── CREATE WEBROOT DIR ────────────────────────────────────────
mkdir -p /var/www/certbot

# ─── OBTAIN CERTIFICATE ───────────────────────────────────────
echo ""
echo "▸ Requesting certificate for $DOMAIN..."
certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d "$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --non-interactive

# ─── UPDATE NGINX CONFIG ──────────────────────────────────────
NGINX_CONF="/etc/nginx/sites-available/incubation"
if [ -f "$NGINX_CONF" ]; then
  echo ""
  echo "▸ Updating Nginx SSL paths..."
  sed -i "s|ssl_certificate .*|ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;|" "$NGINX_CONF"
  sed -i "s|ssl_certificate_key .*|ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;|" "$NGINX_CONF"
  sed -i "s|ssl_trusted_certificate .*|ssl_trusted_certificate /etc/letsencrypt/live/$DOMAIN/chain.pem;|" "$NGINX_CONF"
  nginx -t && systemctl reload nginx
  echo "✓ Nginx reloaded with new certs"
fi

# ─── AUTO-RENEWAL CRON ────────────────────────────────────────
CRON_CMD="0 3 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx' >> /var/log/certbot-renew.log 2>&1"
if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
  echo ""
  echo "▸ Setting up auto-renewal cron (daily at 3 AM)..."
  (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
  echo "✓ Cron job added"
else
  echo "✓ Auto-renewal cron already exists"
fi

# ─── GENERATE DH PARAMS (if not present) ──────────────────────
DH_FILE="/etc/nginx/ssl/dhparam.pem"
if [ ! -f "$DH_FILE" ]; then
  echo ""
  echo "▸ Generating DH parameters (2048-bit)..."
  mkdir -p /etc/nginx/ssl
  openssl dhparam -out "$DH_FILE" 2048
  echo "✓ DH params generated at $DH_FILE"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✓ SSL setup complete for $DOMAIN"
echo "  Certificate: /etc/letsencrypt/live/$DOMAIN/"
echo "  Auto-renewal: daily at 3 AM"
echo "═══════════════════════════════════════════════════════"
