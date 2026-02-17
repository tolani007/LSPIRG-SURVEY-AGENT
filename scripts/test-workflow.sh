#!/usr/bin/env bash
# ─────────────────────────────────────────────
# QR Survey Agent - Test Script
# Sends a test request to the webhook to
# generate a survey QR code.
# ─────────────────────────────────────────────
set -euo pipefail

WEBHOOK_URL="${1:-http://localhost:5678/webhook/generate-survey}"
EVENT_NAME="${2:-Test Event}"

echo "Testing QR Survey Agent..."
echo "  Webhook: $WEBHOOK_URL"
echo "  Event:   $EVENT_NAME"
echo ""

RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{\"event_name\": \"$EVENT_NAME\"}")

echo "Response:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Extract QR URL if jq is available
if command -v jq &> /dev/null; then
  QR_URL=$(echo "$RESPONSE" | jq -r '.qr_url // empty')
  if [ -n "$QR_URL" ]; then
    echo "QR Code URL: $QR_URL"
    echo ""
    echo "Open this URL in a browser to see the QR code."
  fi
fi
