#!/usr/bin/env bash
# ============================================================================
#  Digital Station — Automated VPS Deployment Script
#  Usage: ./deploy/deploy.sh [docker|pm2|systemd]
# ============================================================================

set -euo pipefail

MODE="${1:-docker}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> [1/6] Deploying Digital Station (${MODE} mode) at ${PROJECT_DIR}..."

cd "${PROJECT_DIR}"

# 1. Pull latest git code
if [ -d .git ]; then
  echo "==> [2/6] Pulling latest code from git..."
  git fetch origin
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  git pull origin "${CURRENT_BRANCH}"
fi

# 2. Check environment file
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "==> Warning: .env not found. Creating from .env.example..."
    cp .env.example .env
  fi
fi

# 3. Build & Deploy based on mode
if [ "${MODE}" = "docker" ]; then
  echo "==> [3/6] Building and running Docker container..."
  docker compose build --pull web
  docker compose up -d --remove-orphans web

elif [ "${MODE}" = "pm2" ]; then
  echo "==> [3/6] Installing dependencies and building standalone bundle..."
  npm ci
  npm run build
  echo "==> [4/6] Reloading PM2 cluster..."
  mkdir -p logs
  npx pm2 reload ecosystem.config.js --env production || npx pm2 start ecosystem.config.js --env production

elif [ "${MODE}" = "systemd" ]; then
  echo "==> [3/6] Installing dependencies and building standalone bundle..."
  npm ci
  npm run build
  echo "==> [4/6] Restarting systemd service..."
  sudo systemctl restart digitalstation.service
fi

# 4. Healthcheck verification
echo "==> [5/6] Verifying server healthcheck probe on http://127.0.0.1:3000/fr..."
sleep 3
HEALTH_STATUS=0
for i in {1..10}; do
  if curl -sf -o /dev/null "http://127.0.0.1:3000/fr"; then
    echo "==> [6/6] Healthcheck probe passed! HTTP 200 OK."
    HEALTH_STATUS=1
    break
  fi
  echo "    Waiting for server to become ready ($i/10)..."
  sleep 2
done

if [ ${HEALTH_STATUS} -eq 0 ]; then
  echo "==> ERROR: Server failed health check after deployment!"
  exit 1
fi

echo "============================================================================"
echo " Digital Station successfully deployed and running!"
echo " URL: https://digitalstation.bf"
echo "============================================================================"
