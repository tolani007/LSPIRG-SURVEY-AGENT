#!/usr/bin/env bash
# ─────────────────────────────────────────────
# QR Survey Agent - Setup Script
# ─────────────────────────────────────────────
set -euo pipefail

echo "============================================"
echo "  QR Survey Agent - Setup"
echo "============================================"
echo ""

# Check for Docker
if ! command -v docker &> /dev/null; then
  echo "[ERROR] Docker is not installed."
  echo "  Install: https://docs.docker.com/get-docker/"
  exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
  echo "[ERROR] Docker Compose is not installed."
  exit 1
fi

echo "[OK] Docker found"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  echo "[INFO] Creating .env from .env.example..."
  cp .env.example .env
  echo "[ACTION REQUIRED] Edit .env with your API keys before starting."
  echo ""
else
  echo "[OK] .env file exists"
fi

# Start n8n
echo ""
echo "Starting n8n..."
docker compose up -d

echo ""
echo "============================================"
echo "  n8n is starting up!"
echo "============================================"
echo ""
echo "  Dashboard: http://localhost:5678"
echo "  Default login: admin / changeme"
echo ""
echo "  Next steps:"
echo "    1. Open http://localhost:5678"
echo "    2. Go to Settings > Credentials"
echo "    3. Add your Google Sheets OAuth2 credential"
echo "    4. Add your Telegram Bot credential"
echo "    5. Import workflows/qr-survey-agent.json"
echo "    6. Import workflows/telegram-bot-trigger.json"
echo "    7. Activate both workflows"
echo ""
echo "  See README.md for full setup instructions."
echo "============================================"
