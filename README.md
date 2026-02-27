# QR Survey Agent

Automated agentic workflow that generates QR-coded event surveys with AI-powered sentiment analysis, auto-close after 5 hours, and email delivery of results.

## Architecture

### n8n Workflow Screenshot

![QR Survey Agent — n8n Workflow](docs/images/qr-survey-agent-workflow.png)

> **Save the workflow screenshot** to `docs/images/qr-survey-agent-workflow.png` to display it above.

---

### Node Map (matches screenshot)

**Flow 1 — Survey Generation (top row)**

```
Webhook: Generate Survey
        │
        v
Generate Event ID & URLs
        │
        ├──────────────────────────┐
        v                          v
  Fetch QR Image           Respond with QR Data
        │
        v
 Telegram: Send QR
  (sendMessage)
```

| # | Node Name | Type | Purpose |
|---|-----------|------|---------|
| 1 | **Webhook: Generate Survey** | Webhook | Listens for POST `/survey` with event name |
| 2 | **Generate Event ID & URLs** | Code | Creates `EVT-XXXXXX`, builds pre-filled Form URL + QR URL |
| 3a | **Fetch QR Image** | HTTP Request | Calls QuickChart.io to render the QR code PNG |
| 3b | **Respond with QR Data** | Respond to Webhook | Returns QR URL + Form URL as JSON to the caller |
| 4 | **Telegram: Send QR** | Telegram (sendMessage) | Sends the QR image to the operator's Telegram chat |

**Flow 2 — Response Processing + Kill Switch (bottom row)**

```
Google Sheet: New Response ──> Groq: Sentiment Analysis ──> Parse Sentiment
       (rowAdded)                     (POST)                     │
                                                                 v
                                                    Write Sentiment to Sheet
                                                          (read: sheet)
                                                                 │
                                                                 v
                                                        Is First Response?
                                                           /          \
                                                     true /            \ false
                                                         v              (end)
                                                   Wait 5 Hours
                                                         │
                                                         v
                                                 Close Google Form
                                                         │
                                                         v
                                               Export Sheet as PDF
                                                         │
                                                         v
                                                   Email Results
                                                      (Send)
                                                         │
                                                         v
                                              Telegram: Survey Closed
                                                (sendMessage: message)
```

| # | Node Name | Type | Purpose |
|---|-----------|------|---------|
| 1 | **Google Sheet: New Response** | Google Sheets Trigger (rowAdded) | Fires when a new form response lands in the Sheet |
| 2 | **Groq: Sentiment Analysis** | HTTP Request (POST) | Sends feedback text to Groq `llama-3.1-8b-instant` for classification |
| 3 | **Parse Sentiment** | Code | Extracts the single-word result (`empath` or `needs growth`) from LLM response |
| 4 | **Write Sentiment to Sheet** | Google Sheets (read: sheet) | Writes the sentiment label back to the Sentiment column |
| 5 | **Is First Response?** | IF | Checks if this is row 2 (first real response) to decide whether to start the timer |
| 6 | **Wait 5 Hours** | Wait | Pauses the execution branch for 5 hours (kill switch countdown) |
| 7 | **Close Google Form** | HTTP Request | Calls Google Apps Script to set the form to "not accepting responses" |
| 8 | **Export Sheet as PDF** | HTTP Request | Calls Google Apps Script to export the Sheet as a PDF file |
| 9 | **Email Results** | Send Email | Emails the PDF report to `tolaniakinola@gmail.com` |
| 10 | **Telegram: Survey Closed** | Telegram (sendMessage) | Notifies the operator that the survey window has ended |

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
- **Survey**: Google Forms (one question, pre-filled Event ID)
- **Database**: Google Sheets (Timestamp, Feedback, Sentiment)
- **LLM**: Groq API (llama-3.1-8b-instant, free tier)
- **QR Generator**: QuickChart.io (free, no auth)
- **Trigger**: Telegram Bot or Webhook
- **Form Control**: Google Apps Script (close form, export PDF)

## Project Structure

```
LSPIRG-SURVEY-AGENT/
├── docker-compose.yml              # n8n container
├── .env.example                    # Environment variables template
├── workflows/
│   ├── qr-survey-agent.json        # Main n8n workflow
│   ├── telegram-bot-trigger.json   # Telegram bot trigger workflow
│   └── groq-sentiment-node.json    # Standalone Groq HTTP config
├── google-apps-script/
│   └── Code.gs                     # Apps Script for form close + PDF export
├── scripts/
│   ├── setup.sh                    # One-command setup
│   └── test-workflow.sh            # Test the webhook
├── docs/
│   └── images/
│       └── qr-survey-agent-workflow.png  # n8n workflow screenshot
└── README.md
```

## Setup Guide

### Prerequisites

- Docker and Docker Compose
- Google account
- Telegram account (optional, for bot trigger)

### Step 1: Google Form

1. Go to [Google Forms](https://forms.google.com) and create a new form
2. Add **one question**: "How was the event? Would you come back?" (Paragraph type)
3. Add a **hidden field** for Event ID (Short answer, in a section or as question 2)
4. Link the form to a **new Google Sheet** (Responses tab > Spreadsheet icon)
5. In the Sheet, add a column header **Sentiment** in column C (or after the last form column)
6. Note the **Form ID** (from the URL: `docs.google.com/forms/d/{FORM_ID}/edit`)
7. Note the **Sheet ID** (from the URL: `docs.google.com/spreadsheets/d/{SHEET_ID}/edit`)
8. Note the **pre-fill entry ID**: Open the form, click the 3 dots > "Get pre-filled link", fill in the Event ID field, click "Get link". The URL will contain `entry.XXXXXXX=` - that's your entry field ID.

### Step 2: Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Paste the contents of `google-apps-script/Code.gs`
4. Deploy > New Deployment > Web App
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment URL
6. Test: visit `{DEPLOYMENT_URL}?action=setup_formatting&sheet_id={YOUR_SHEET_ID}`
   - This applies the purple/lime-green conditional formatting automatically

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
4. Sends the feedback text to Groq (llama-3.1-8b-instant) with the sentiment prompt
5. LLM returns either `empath` or `needs growth`
6. Result is written to the Sentiment column in the Sheet
7. Conditional formatting auto-colors: **Purple** = empath, **Lime-Green** = needs growth

### Phase 3: Kill Switch (5-hour window)
1. When the **first** response arrives (row 2), n8n starts a 5-hour timer
2. After 5 hours:
   - Calls Google Apps Script to **close the form** (no more responses)
   - Exports the Sheet as **PDF**
   - **Emails** the PDF to `tolaniakinola@gmail.com`
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
```

## Conditional Formatting

| Sentiment | Background | Font | Hex |
|-----------|-----------|------|-----|
| empath | Purple | White | #A020F0 |
| needs growth | Lime-Green | Black | #32CD32 |

Set automatically via the Apps Script `setup_formatting` action, or manually in Google Sheets:
Format > Conditional formatting > Add rules on the Sentiment column.

## Sprint Plan

### Sprint 1 (Done)
- [x] Project structure and Docker setup
- [x] n8n workflow: QR generation via webhook
- [x] n8n workflow: Telegram bot trigger
- [x] Groq sentiment analysis node
- [x] Google Apps Script: form close + PDF export + formatting
- [x] 5-hour kill switch with Wait node
- [x] Email delivery of results
- [x] Workflow screenshot & node map documented in README

---

### Next-Hour Micro-Sprint — Deploy & Validate (Scrum)

> **Sprint Goal:** Get the QR Survey Agent running end-to-end on a live n8n instance with real Google Form, Groq, and Telegram integrations — proving every node in the screenshot fires correctly.

| # | Task | Timebox | Acceptance Criteria | Status |
|---|------|---------|---------------------|--------|
| 1 | **Stand-up: Verify workflow JSONs match screenshot** | 2 min | All 15 nodes in `qr-survey-agent.json` correspond 1-to-1 with the screenshot's node names and connections | `[ ]` |
| 2 | **Spin up n8n via Docker** | 8 min | `docker compose up -d` succeeds; n8n UI reachable at `localhost:5678`; login with initial admin credentials | `[ ]` |
| 3 | **Create Google Form + linked Sheet** | 10 min | Form has 1 paragraph question + 1 short-answer Event ID field; linked Sheet exists with "Sentiment" column header in column C; Form ID, Sheet ID, and entry field ID noted in `.env` | `[ ]` |
| 4 | **Deploy Google Apps Script** | 5 min | `Code.gs` deployed as Web App; `?action=setup_formatting&sheet_id=...` returns success; purple/lime conditional formatting visible in Sheet | `[ ]` |
| 5 | **Obtain Groq API key** | 5 min | API key generated at `console.groq.com`; test curl `POST /chat/completions` with `llama-3.1-8b-instant` returns 200 | `[ ]` |
| 6 | **Create Telegram bot** | 5 min | Bot token from BotFather; chat ID from @userinfobot; test `sendMessage` via curl returns OK | `[ ]` |
| 7 | **Import workflows & wire credentials** | 10 min | Both workflow JSONs imported into n8n; Google OAuth2, Groq HTTP header, Telegram credentials attached; all placeholder IDs replaced with real values; both workflows activated (green toggle) | `[ ]` |
| 8 | **Smoke test: QR generation** | 5 min | POST to webhook returns JSON with `qrUrl` and `formUrl`; QR image renders in browser; Telegram bot receives QR image message | `[ ]` |
| 9 | **E2E test: Full response loop** | 5 min | Scan QR on phone → submit feedback in Google Form → new row appears in Sheet within 60s → Sentiment column auto-filled with `empath` or `needs growth` → conditional formatting colors applied | `[ ]` |
| 10 | **Validate kill switch branch** | 3 min | Confirm `Is First Response?` node evaluates `true` on row 2; Wait node shows "Waiting" state in n8n execution log; (optionally reduce wait to 1 min for testing, then revert to 5 hours) | `[ ]` |
| 11 | **Sprint review & retro** | 2 min | Document any bugs or blockers in a `KNOWN_ISSUES.md` or GitHub Issue; update Sprint Plan checkboxes; tag the commit `v0.1.0-alpha` if all green | `[ ]` |

**Total: ~60 minutes**

#### Definition of Done (Micro-Sprint)
- [ ] QR code generated from webhook trigger and delivered via Telegram
- [ ] At least 1 real form response processed with correct sentiment label
- [ ] Kill switch branch confirmed active (Wait node entered)
- [ ] All credentials stored in n8n (not hard-coded in workflow JSON)
- [ ] No errors in n8n execution log for the happy path

---

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

## License

MIT
