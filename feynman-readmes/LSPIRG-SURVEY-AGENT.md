# LSPIRG Survey Agent
> I built a fully automated event survey system with AI sentiment analysis that costs literally zero dollars a month to run.

## What I Built (and Why You Should Care)

I needed a way to collect feedback at events -- real, honest feedback -- and actually do something useful with it. Not just "dump responses into a spreadsheet and maybe look at it next week." I wanted the whole pipeline: someone scans a QR code at an event, fills out a quick survey, and within seconds an AI reads their response, classifies their sentiment, and the results get packaged into a report. All automated. All free.

So I built exactly that. The system uses n8n (an open-source workflow automation platform I self-host with Docker) as the brain, Google Forms and Sheets as the data layer, Groq's API running Llama 3.1 for sentiment classification, QuickChart for QR code generation, and a Telegram bot as the trigger and notification channel. There is even a 5-hour kill switch that automatically shuts down the survey after the event ends, exports everything to PDF, and emails the results.

Here is the part I am most proud of: the entire system costs $0/month to operate. Groq offers a generous free tier for LLM inference. Google Forms and Sheets are free. n8n is self-hosted. Telegram bots are free. QuickChart is free. This is what I mean by cost-conscious engineering -- you do not need a big budget to build sophisticated systems. You need good architecture.

## The Core Concepts - Explained Simply

### Workflow Orchestration with n8n
Think of n8n like a series of dominoes. You set them up so that when the first one falls (a trigger event), each subsequent domino falls in order, and each one does something useful along the way. Except these dominoes can call APIs, read databases, run code, send messages, and make decisions. n8n gives you a visual canvas where you drag nodes around and connect them with wires. Each node is a step: "fetch data from this API," "transform this JSON," "send this Telegram message." It is like Zapier or Make, but open-source and self-hosted, which means I control everything and pay nothing.

### LLM-Powered Sentiment Classification
Here is where it gets interesting. When a survey response comes in, I do not just store it -- I send it to Groq's API, which runs Llama 3.1 (an open-source large language model). I give the LLM a prompt that says something like: "Classify this feedback as either 'empathetic/positive' or 'needs growth/constructive'." The model reads the response and returns a label. Think of it like hiring a very fast, very cheap research assistant who reads every piece of feedback and tags it for you. The key insight: LLMs are not just for chatbots. They are classification engines, summarizers, and pattern detectors. Using them for structured classification tasks like this is one of the most practical applications in production systems today.

### QR Code Generation
A QR code is just a URL encoded as a visual pattern that phone cameras can read. I use the QuickChart API to generate a QR code that points to my Google Form. When someone at an event scans it, their phone opens the survey. The magic is in the automation: when an organizer sends a Telegram command to start a new event survey, the system generates a fresh QR code on the fly and sends it back. No manual steps.

### Event-Driven Architecture
The whole system is event-driven. Nothing runs on a schedule polling for changes. Instead, things happen in response to events: "A Telegram message arrived" triggers QR generation. "A new form response appeared in the Google Sheet" triggers sentiment analysis. "Five hours have passed" triggers the kill switch. This is the same pattern behind AWS Lambda, Google Cloud Functions, and every modern microservice. Events in, actions out.

### Docker and Self-Hosting
n8n runs inside a Docker container, which I define in `docker-compose.yml`. Think of Docker as a shipping container for software -- it packages the application with all its dependencies so it runs the same way everywhere. My laptop, a cloud VM, a Raspberry Pi -- does not matter. `docker-compose up` and the whole system is live. Self-hosting means I own my data, I control the uptime, and I do not pay subscription fees.

### The Kill Switch Pattern
After 5 hours, the system automatically stops accepting responses, generates a PDF summary, and emails it to the organizer. This is a timer-based lifecycle pattern. It prevents stale surveys from collecting junk data after an event ends. In production systems, this is similar to TTLs (time-to-live) on cache entries or auto-expiring tokens. The principle: every resource should have a defined lifecycle.

### Google Apps Script as Glue Code
Google Apps Script (in `google-apps-script/Code.gs`) is serverless JavaScript that runs inside Google's ecosystem. I use it to bridge the gap between Google Sheets and n8n -- when a new row appears in the Sheet, the script can trigger a webhook. Think of it as a tiny butler living inside your spreadsheet, watching for changes and notifying the outside world.

### Cost Optimization as a Design Principle
Every architectural decision in this project was filtered through "can I do this for free?" Not because I am cheap, but because cost discipline forces elegant design. Free tiers are generous if you architect around them. Groq gives you thousands of free API calls. Google Forms/Sheets are free. Docker on your own machine is free. The constraint of zero budget produced a cleaner system than unlimited budget would have.

## How It Actually Works - Step by Step

1. **Trigger:** An event organizer sends a command to the Telegram bot (e.g., "Start survey for LSPIRG Workshop").
2. **QR Generation:** n8n catches the Telegram message, calls QuickChart API to generate a QR code pointing to a Google Form, and sends the QR image back via Telegram.
3. **Distribution:** The organizer displays or prints the QR code at the event. Attendees scan it with their phones.
4. **Data Collection:** Attendees fill out the Google Form. Responses land in a Google Sheet automatically.
5. **Sentiment Analysis:** When a new row appears in the Sheet, n8n picks it up, sends the free-text feedback to Groq's Llama 3.1 model, and writes the sentiment label back to the Sheet.
6. **Kill Switch:** A timer node in n8n counts down from 5 hours. When it fires, the workflow closes the form, exports the Sheet to PDF, and emails the report to the organizer.
7. **Notification:** Throughout the process, the Telegram bot sends status updates -- "Survey started," "15 responses collected," "Survey closed, report sent."

## What This Taught Me (And What It'll Teach You)

- **Workflow orchestration is a superpower.** Tools like n8n, Airflow, and Prefect let you automate complex multi-step processes. This is the backbone of data engineering and DevOps.
- **LLMs as classification tools.** Forget chatbots -- the real value of LLMs in production is structured tasks: classification, extraction, summarization. I send text in, I get labels out.
- **Event-driven thinking.** When you stop thinking in terms of "run this script every hour" and start thinking "react when this happens," your systems become more responsive and efficient.
- **Docker for reproducibility.** One `docker-compose.yml` and anyone can run my entire system. This is the foundation of modern deployment.
- **API integration patterns.** This project chains together five different APIs (Telegram, QuickChart, Google Sheets, Groq, email). Learning to read API docs, handle auth, and parse responses is a career-long skill.
- **Cost engineering.** Building production-quality systems on free tiers teaches you to evaluate trade-offs. What does the free tier give you? What are the rate limits? What breaks if you scale?
- **Shell scripting for automation.** The `scripts/` directory has setup and test scripts. Knowing bash well enough to automate setup and testing is underrated.

## Interview Confidence Builder

**Q: How would you build an automated data collection pipeline?**
Walk through the full flow: trigger mechanism (Telegram bot), data capture (Google Forms), storage (Google Sheets), processing (Groq LLM for sentiment), and reporting (PDF export + email). Emphasize the event-driven nature -- nothing polls, everything reacts.

**Q: What is workflow orchestration, and how is it different from a cron job?**
A cron job says "run this at midnight." Orchestration says "run step B after step A succeeds, run step C in parallel, and if step B fails, retry three times then alert me." n8n, Airflow, and Prefect are orchestrators. Cron is just a scheduler. Orchestration gives you dependency management, error handling, retries, and monitoring.

**Q: How do you use LLMs in production beyond chatbots?**
Classification, entity extraction, summarization, translation, and data enrichment. In this project, I use Llama 3.1 for binary sentiment classification. The key is structured prompting: give the model clear instructions and a constrained output format. This is the same pattern behind every AI feature in modern SaaS products.

**Q: Explain Docker and why you used it here.**
Docker packages an application with all its dependencies into a container that runs identically everywhere. I used it because n8n has specific version requirements and dependencies that I do not want to install globally on my machine. `docker-compose.yml` defines the service, and `docker-compose up` runs it. It is reproducible, isolated, and shareable.

**Q: How do you design systems that cost nothing to operate?**
Map your requirements to free tiers. Google Sheets for storage (up to 10M cells). Groq for LLM inference (generous free tier). Self-hosted n8n (free on your own hardware). Telegram bots (free). The design principle is: minimize external paid services by leveraging free-tier offerings and self-hosting where possible. The trade-off is usually operational overhead (you maintain the infrastructure).

**Q: What is an event-driven architecture?**
Instead of components polling each other ("Any new data? Any new data? Any new data?"), components publish events and other components subscribe to them. A new form response is an event. A timer expiring is an event. A Telegram message is an event. This pattern reduces wasted computation, improves responsiveness, and decouples components.

**Q: How did you handle the lifecycle of the survey?**
A 5-hour kill switch. When the survey starts, a timer begins. When it expires, the system automatically closes the form, generates a PDF report, and emails it. This prevents stale data collection and ensures every survey has a clean start and end. The same principle applies to session tokens, cache entries, and temporary resources.

**Q: What would you change if this needed to scale to 10,000 respondents?**
Replace Google Sheets with a proper database (PostgreSQL). Replace self-hosted n8n with a managed orchestrator or AWS Step Functions. Add a queue (SQS or RabbitMQ) between form submission and sentiment analysis to handle bursts. Use a load balancer in front of the form endpoint. The architecture is already event-driven, so scaling is mostly about swapping components, not redesigning.

## Get Started

```bash
# Clone the repo
git clone https://github.com/tolani007/LSPIRG-SURVEY-AGENT.git
cd LSPIRG-SURVEY-AGENT

# Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or start manually with Docker
docker-compose up -d

# Test the workflow
chmod +x scripts/test-workflow.sh
./scripts/test-workflow.sh
```

You will also need to configure:
- A Telegram bot token (via BotFather)
- Google Forms/Sheets API credentials
- A Groq API key (free tier)

Check the workflow JSON files in `workflows/` for the n8n configuration.

## How This Connects

This project is where my automation instincts meet real-world utility. The **Docker skills** here are the same ones I use in every deployment. The **API integration pattern** (chaining multiple services together) is exactly what I do in my [Neon Tic-Tac-Toe](neon-tic-tac-toe.md) project with Express and cloud services. The **LLM classification** technique connects to my broader AI/ML work -- it is the same thinking behind feature engineering in my data science projects, just applied to text. And the cost-optimization mindset? That shows up everywhere. If I can build something that works for $0, imagine what I can do with a real budget.
