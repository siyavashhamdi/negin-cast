#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  echo "Missing .env. Copy .env.example and set CAPACITOR_SERVER_URL first."
  exit 1
fi

if [[ ! -f web/app/.env ]]; then
  echo "Missing web/app/.env. Copy web/app/.env.example first."
  exit 1
fi

echo "Installing dependencies..."
npm install
npm install --prefix web/app

if [[ -f android/app/build/outputs/apk/debug/app-debug.apk ]]; then
  echo "Copying latest APK into web public assets..."
  cp android/app/build/outputs/apk/debug/app-debug.apk web/app/public/app-debug.apk
fi

echo "Building web app..."
npm run build:web

if ! command -v pm2 >/dev/null 2>&1; then
  echo "PM2 is not installed. Install it globally with: npm install -g pm2"
  exit 1
fi

echo "Starting web app with PM2..."
pm2 restart ecosystem.config.cjs 2>/dev/null || pm2 start ecosystem.config.cjs
pm2 save

echo
echo "Deployment complete."
echo "Web app: http://0.0.0.0:6000"
echo "Public URL: http://198.144.180.146:6000/"
echo
echo "Useful commands:"
echo "  pm2 status"
echo "  pm2 logs"
echo "  npm run stop"
