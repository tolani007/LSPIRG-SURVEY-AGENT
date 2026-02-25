# QR Survey Agent

Automated agentic workflow that generates QR-coded event surveys with AI-powered sentiment analysis, auto-close after 5 hours, and email delivery of anonymized results.

**Zero respondent data leaves the system.** All attendees are anonymous.

## Architecture

```
User Trigger (Webhook / Telegram)
        |
        v
   ┌─────────┐     ┌──────────────┐     ┌─────────┐
   │  n8n     │────>│ QuickChart   │────>│ QR Code │
   │ (orch.)  │     │ (free QR)    │     │ to user │
   └────┬─────┘     └──────────────┘     └─────────┘
        |
        v  (Google Form response arrives)
   ┌─────────┐     ┌──────────────┐     ┌──────────────┐
   │ Google   │────>│ PII Scrubber │────>│ Groq LLM     │
   │ Sheets   │     │ (strip all   │     │ (sentiment    │
   │ Trigger  │     │  identity)   │     │  on clean     │
   └─────────┘     └──────────────┘     │  text only)   │
                                         └──────┬───────┘
                                                |
                                                v
                                   ┌────────────────────────┐
                                   │ 5-Hour Kill Switch      │
                                   │ Close Form              │
                                   │ → Anonymize Sheet       │
                                   │ → Export Anonymized PDF │
                                   │ → Email Results         │
                                   │ → Purge Raw Data        │
                                   └────────────────────────┘
```

## Privacy & Anonymity

This system is built with **defense-in-depth anonymity**. No respondent can be traced back to their identity, location, or device.

### Anonymity Guarantees

| Layer | What It Does |
|-------|-------------|
| Google Form Config | No email collection, no sign-in required, no "Respondent URL" tracking |
| PII Scrubber (n8n) | Strips emails, phones, URLs, IPs, social handles, names, zip codes from feedback BEFORE it reaches any API |
| PII Scrubber (Apps Script) | Second scrub pass before PDF export (defense-in-depth) |
| Anonymized Export | Creates separate sheet with only: Response #, Feedback, Sentiment. No Timestamps. |
| Raw Data Purge | After export, all raw response data is deleted from Google Sheets |
| LLM Privacy | Groq only sees sanitized text. System prompt forbids echoing feedback. |
| Email Recipient | Receives ONLY the anonymized PDF. No Timestamps, no emails, no IPs. |

### What Gets Redacted

```
Emails:        john@example.com         → [REDACTED]
Phones:        +1 (555) 123-4567        → [REDACTED]
URLs:          https://mysite.com/page   → [REDACTED]
IPs:           192.168.1.100            → [REDACTED]
Social:        @johndoe                 → [REDACTED]
Self-ID:       "My name is John Smith"  → [REDACTED]
Zip codes:     90210                    → [REDACTED]
```

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| n8n (self-hosted) | $0 | Docker on any machine |
| Google Forms/Sheets | $0 | Free with Google account |
| Groq API | $0 | Free tier: 30 req/min, llama-3.1-8b |
| QuickChart QR | $0 | Free, no API key needed |
| Telegram Bot | $0 | Free via BotFather |
| **Total** | **$0/mo** | |

If you need cloud hosting for n8n: Railway.app free tier or a $5/mo VPS.

## Stack

- **Orchestrator**: n8n (self-hosted via Docker)
- **Survey**: Google Forms (one question, no sign-in, no email collection)
- **Database**: Google Sheets (anonymized before export)
- **LLM**: Groq API (llama-3.1-8b-instant, free tier)
- **QR Generator**: QuickChart.io (free, no auth)
- **Trigger**: Telegram Bot or Webhook
- **Form Control**: Google Apps Script (close, anonymize, export, purge)

## Project Structure

```
LSPIRG-SURVEY-AGENT/
├── docker-compose.yml              # n8n container
├── .env.example                    # Environment variables template
├── workflows/
│   ├── qr-survey-agent.json        # Main n8n workflow (with PII scrubber)
│   ├── telegram-bot-trigger.json   # Telegram bot trigger workflow
│   └── groq-sentiment-node.json    # Standalone Groq HTTP config
├── google-apps-script/
│   └── Code.gs                     # Apps Script: close, anonymize, export, purge
├── scripts/
│   ├── setup.sh                    # One-command setup
│   └── test-workflow.sh            # Test the webhook
└── README.md
```

## Setup Guide

### Prerequisites

- Docker and Docker Compose
- Google account
- Telegram account (optional, for bot trigger)

### Step 1: Google Form (Privacy-Hardened)

1. Go to [Google Forms](https://forms.google.com) and create a new form
2. Add **one question**: "How was the event? Would you come back?" (Paragraph type)
3. Add a **hidden field** for Event ID (Short answer, as question 2)
4. **CRITICAL PRIVACY SETTINGS** (click the gear icon):
   - General tab:
     - UNCHECK "Collect email addresses"
     - UNCHECK "Limit to 1 response" (requires sign-in)
   - Presentation tab:
     - UNCHECK "Show link to submit another response"
   - Defaults tab:
     - UNCHECK "Collect email addresses by default"
5. In the form's 3-dot menu, ensure "Require sign-in" is **OFF**
6. Link the form to a **new Google Sheet** (Responses tab > Spreadsheet icon)
7. In the Sheet, add a column header **Sentiment** after the last form column
8. Note the **Form ID** (from the URL: `docs.google.com/forms/d/{FORM_ID}/edit`)
9. Note the **Sheet ID** (from the URL: `docs.google.com/spreadsheets/d/{SHEET_ID}/edit`)
10. Note the **pre-fill entry ID**: Open form > 3 dots > "Get pre-filled link" > fill Event ID field > "Get link". The URL contains `entry.XXXXXXX=`

### Step 2: Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Paste the contents of `google-apps-script/Code.gs`
4. Deploy > New Deployment > Web App
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment URL
6. Test: visit `{DEPLOYMENT_URL}?action=setup_formatting&sheet_id={YOUR_SHEET_ID}`

### Step 3: Groq API Key

1. Go to [Groq Console](https://console.groq.com/keys)
2. Create a free account and generate an API key
3. Free tier: 30 requests/minute with llama-3.1-8b-instant

### Step 4: Telegram Bot (Optional)

1. Open Telegram, message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`, follow prompts
3. Save the bot token
4. Get your chat ID: message [@userinfobot](https://t.me/userinfobot)

### Step 5: Deploy n8n

```bash
# Clone and setup
cp .env.example .env
# Edit .env with your actual values

# Start n8n
./scripts/setup.sh
# Or manually: docker compose up -d
```

### Step 6: Configure n8n

1. Open `http://localhost:5678`
2. **Add Credentials** (Settings > Credentials):
   - **Google Sheets OAuth2**: Follow n8n's built-in OAuth flow
   - **Telegram Bot**: Paste your bot token
3. **Import Workflows**:
   - Go to Workflows > Import from File
   - Import `workflows/qr-survey-agent.json`
   - Import `workflows/telegram-bot-trigger.json`
4. **Update placeholders** in each workflow:
   - Replace `YOUR_FORM_ID` with your Google Form ID
   - Replace `YOUR_APPS_SCRIPT_DEPLOYMENT_ID` with your Apps Script URL
   - Replace `EVENT_ID_FIELD` with your form's entry field ID
5. **Activate** both workflows

### Step 7: Test

```bash
# Test via webhook
./scripts/test-workflow.sh

# Test via Telegram
# Send to your bot: /survey My Test Event
```

## How It Works

### Phase 1: Survey Generation
1. You trigger the agent (Telegram `/survey EventName` or POST to webhook)
2. Agent generates a unique Event ID (`EVT-XXXXXX`)
3. Builds a pre-filled Google Form URL with that Event ID
4. Calls QuickChart to generate a QR code image of that URL
5. Sends the QR code back to you (Telegram image or JSON response)

### Phase 2: Sentiment Analysis (per response)
1. Someone scans the QR code, opens the Google Form, submits feedback
2. The response lands in the linked Google Sheet
3. n8n detects the new row (polling trigger)
4. **PII Scrubber** strips all personally identifiable info from the feedback text
5. Sanitized text is sent to Groq (llama-3.1-8b-instant) with the sentiment prompt
6. LLM returns either `empath` or `needs growth`
7. Result is written to the Sentiment column in the Sheet
8. Conditional formatting auto-colors: **Purple** = empath, **Lime-Green** = needs growth

### Phase 3: Kill Switch & Anonymized Export (5-hour window)
1. When the **first** response arrives (row 2), n8n starts a 5-hour timer
2. After 5 hours:
   - **Closes** the Google Form (no more responses)
   - **Anonymizes** the data (creates clean sheet with no Timestamps/PII)
   - **Exports** the anonymized sheet as PDF
   - **Emails** the anonymized PDF to the configured address
   - **Purges** all raw response data from the original sheet
   - Sends a **Telegram notification** confirming closure

## Sentiment Prompt

```
You are a sentiment analysis engine for event feedback.
Your job is to determine if an attendee is likely to return
to future events based on their feedback.

Rules:
- If positive → output ONLY: empath
- If negative → output ONLY: needs growth
- No explanation. No punctuation. Just one phrase.
- NEVER echo back or reference any part of the user's feedback text.
```

## Conditional Formatting

| Sentiment | Background | Font | Hex |
|-----------|-----------|------|-----|
| empath | Purple | White | #A020F0 |
| needs growth | Lime-Green | Black | #32CD32 |

Set automatically via the Apps Script `setup_formatting` action, or manually in Google Sheets:
Format > Conditional formatting > Add rules on the Sentiment column.

## Sprint Plan

### Sprint 1 (Current)
- [x] Project structure and Docker setup
- [x] n8n workflow: QR generation via webhook
- [x] n8n workflow: Telegram bot trigger
- [x] Groq sentiment analysis node
- [x] Google Apps Script: form close + PDF export + formatting
- [x] 5-hour kill switch with Wait node
- [x] Email delivery of results
- [x] PII scrubbing layer (n8n Code node)
- [x] Anonymized sheet export (Apps Script)
- [x] Raw data purge after export
- [x] Privacy-hardened Google Form setup guide
- [ ] Deploy and end-to-end test

### Sprint 2 (Backlog)
- [ ] Multi-event support (concurrent surveys)
- [ ] Dashboard view in Google Sheets (charts)
- [ ] Response rate tracking
- [ ] Customizable survey duration (not just 5 hours)
- [ ] Slack integration as alternative to Telegram

## Troubleshooting

**n8n won't start**: Check Docker is running. Run `docker compose logs` for errors.

**Google Sheets trigger not firing**: Ensure the OAuth credential has Sheets + Drive scopes. The trigger polls every minute by default.

**Groq returns errors**: Check your API key. Free tier has rate limits (30 req/min). The workflow uses `llama-3.1-8b-instant` which is the fastest free model.

**Form won't close**: Make sure the Apps Script is deployed as a Web App with "Anyone" access, and the Form ID is correct.

**QR code not generating**: QuickChart.io is free and usually reliable. Test the URL directly in a browser: `https://quickchart.io/qr?text=hello&size=300`

**Anonymized sheet missing**: The `export_anonymized` action must be called before `export_pdf?anonymized=true`. The main workflow handles this automatically.

## License

MIT
