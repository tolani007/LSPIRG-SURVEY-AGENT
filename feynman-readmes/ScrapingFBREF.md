# ScrapingFBREF
> I taught my computer to read football websites the way I do -- except it never gets tired, never loses its place, and saves everything neatly into spreadsheets.

## What I Built (and Why You Should Care)

So here's the thing -- if you want to do serious football analytics, you need data. Lots of it. And the best free source of Premier League match statistics lives on FBref.com. But copying and pasting hundreds of tables by hand? That's not analytics, that's punishment. So I built a scraper.

This project is a full Python web scraper that goes to FBref, reads through multiple seasons of Premier League data -- shooting stats, passing stats, defensive stats, possession stats -- and packages it all into clean CSV files. But it's not just a quick-and-dirty script. I built it with respect for the website (rate limiting, rotating headers, exponential backoff), resilience (checkpoint system so it can resume if interrupted), and usability (a Flask web UI so you don't even need to touch the command line). This is the data pipeline that feeds my EPL-WinPredictor project and everything else downstream.

Why should you care? Because every data science interview will eventually ask you: "Where did your data come from?" And if your answer is "I downloaded a Kaggle CSV," that's fine. But if your answer is "I built a production-grade scraper with rate limiting, exponential backoff, checkpoint recovery, and a web interface" -- now you're showing engineering maturity. This project is that answer.

## The Core Concepts - Explained Simply

### Web Scraping (What It Really Is)

Think of a web page like a restaurant menu printed on paper. When you look at it, you see nicely formatted text, images, prices. But underneath, it's just HTML -- a structured document with tags that tell the browser how to display things. Web scraping is like hiring someone who can read the raw HTML and pull out exactly the data you need. BeautifulSoup is that reader.

### BeautifulSoup and HTML Parsing

HTML is a tree structure. Imagine a family tree: the `<html>` tag is the great-grandparent, `<body>` is the grandparent, `<div>` tags are parents, and the actual data (text, numbers) are the children. BeautifulSoup lets me navigate this tree. I can say "find the table with class 'stats_table'" and it goes straight to it, like knowing exactly which branch of the family tree your cousin is on.

```python
soup = BeautifulSoup(html_content, 'html.parser')
table = soup.find('table', {'class': 'stats_table'})
```

That's it. Two lines and I've grabbed a whole stats table.

### Rate Limiting (Being a Good Neighbor)

Imagine you're at a library and you keep asking the librarian for books -- one after another, nonstop. Eventually she's going to get annoyed and kick you out. Websites work the same way. If you hit FBref with 100 requests per second, they'll block your IP. Rate limiting means I deliberately slow down my requests. I'm being polite. I'm waiting my turn.

In practice, this means adding `time.sleep()` between requests and monitoring response status codes. A 429 status code means "you're asking too fast" -- the digital equivalent of the librarian glaring at you.

### Exponential Backoff (The Smart Way to Retry)

Now here's where it gets clever. When the website says "slow down," I don't just wait a fixed amount of time. I use exponential backoff. First retry: wait 2 seconds. Second retry: wait 4 seconds. Third retry: wait 8 seconds. Each time, I double the wait.

Think of it like knocking on someone's door. If they don't answer in 5 seconds, you wait 10 seconds and knock again. Still no answer? Wait 20 seconds. You're being progressively more patient. This is an industry standard pattern used in everything from AWS services to mobile apps. Every backend engineer knows this pattern, and interviewers love asking about it.

```python
for attempt in range(max_retries):
    response = requests.get(url)
    if response.status_code == 200:
        break
    wait_time = base_delay * (2 ** attempt)  # 2, 4, 8, 16...
    time.sleep(wait_time)
```

### Rotating User-Agent Headers (Digital Disguises)

Every time your browser visits a website, it sends a "User-Agent" string that identifies itself -- like showing your ID at the door. If a scraper sends the same ID every time, the website notices. Using `fake-useragent`, I rotate through different browser identities. One request looks like Chrome on Windows. The next looks like Firefox on Mac. It's not about deception -- it's about making my traffic look like normal, diverse web traffic.

### Checkpoint System (Never Lose Progress)

Imagine writing a 50-page paper and your computer crashes at page 47. Without saving, you start from scratch. With a checkpoint system, you pick up at page 47. My scraper saves its progress to `scraper_checkpoint.json` after each successful batch. If it crashes, gets rate-limited, or I just close my laptop, it knows exactly where to resume. This is the same concept behind database transaction logs and machine learning training checkpoints.

### Flask Web UI (Making It Friendly)

Flask is a micro web framework. Think of it as the simplest possible way to put a user interface on a Python script. Instead of running commands in a terminal, users can open a browser, click buttons, and watch the scraper work. The `app.py` file creates a simple web server, the `static/` folder holds CSS and JavaScript for the frontend, and Flask routes connect button clicks to Python functions.

### Data Pipeline (Web to CSV)

The whole project is really an ETL pipeline:
- **Extract:** Pull HTML from FBref
- **Transform:** Parse HTML into structured data with BeautifulSoup and pandas
- **Load:** Save clean data to CSV files

This is the same pattern that powers every data warehouse at every company. The scale is different, but the architecture is identical.

## How It Actually Works - Step by Step

1. **Configuration:** I define which seasons, teams, and stat categories I want. The scraper knows the URL patterns for FBref.
2. **Request Phase:** Using the `requests` library with a rotating User-Agent header, I fetch the HTML page for each team's stats in each season.
3. **Politeness Layer:** Between each request, I wait. If I get a 429 or 5xx error, exponential backoff kicks in. The scraper is patient.
4. **Parsing Phase:** BeautifulSoup takes the raw HTML and finds the stats tables. Pandas' `read_html()` can also parse tables directly, but BeautifulSoup gives me finer control.
5. **Checkpoint Save:** After each successful batch, the scraper writes its current position to `scraper_checkpoint.json`. If anything goes wrong, we resume from here.
6. **Data Assembly:** Individual team/season dataframes get merged and concatenated into comprehensive datasets.
7. **Export:** Final clean data goes to CSV, ready for analysis or model training.
8. **Web UI (Optional):** The Flask app in `app.py` wraps this whole process in a browser-friendly interface with real-time progress updates.

## What This Taught Me (And What It'll Teach You)

- **HTTP fundamentals:** Status codes (200, 403, 429, 500), headers, request/response cycles -- the backbone of the internet
- **Defensive programming:** What happens when things go wrong? Rate limits, connection timeouts, malformed HTML. My code handles all of it.
- **ETL pipeline design:** Extract, Transform, Load -- the pattern behind every data engineering job
- **State management:** The checkpoint system taught me to think about idempotency and crash recovery
- **Web development basics:** Flask, HTML templates, CSS styling, serving static files
- **pandas data manipulation:** Merging, concatenating, cleaning dataframes -- the daily bread of data science
- **Respectful scraping:** robots.txt, rate limiting, terms of service -- the ethics matter
- **Production-mindset coding:** This isn't a notebook experiment. It has error handling, logging, configuration, and a UI.

## Interview Confidence Builder

**Q: "How would you design a web scraper that needs to run reliably over hours?"**
Talk about the checkpoint system. Explain that any long-running process needs to be resumable. Mention idempotency -- the ability to restart without duplicating work. Reference `scraper_checkpoint.json` and how it tracks which pages have been scraped.

**Q: "What is exponential backoff and when would you use it?"**
Explain the doubling wait pattern. Mention it's standard in distributed systems -- AWS SDKs use it, gRPC uses it, every retry library uses it. The key insight: it prevents thundering herd problems where many clients retry simultaneously and overwhelm the server.

**Q: "How do you handle rate limiting in APIs or web scraping?"**
Three layers: proactive delays between requests, reactive exponential backoff on 429 responses, and rotating User-Agent headers to distribute load patterns. Emphasize that you respect the service's constraints.

**Q: "Describe an ETL pipeline you've built."**
Walk through Extract (HTTP requests to FBref), Transform (BeautifulSoup parsing, pandas cleaning), Load (CSV export). Mention that this pattern scales -- replace requests with Kafka consumers, replace CSV with a data warehouse, and you have enterprise ETL.

**Q: "How do you make a data pipeline fault-tolerant?"**
Checkpointing, retry logic with backoff, graceful error handling, and logging. The scraper can crash at any point and resume without data loss or duplication.

**Q: "Tell me about a time you built something beyond a Jupyter notebook."**
This project has a Flask web UI, modular Python scripts, a checkpoint system, and handles real-world failure modes. It's production-adjacent, not just exploratory.

**Q: "What's the difference between requests and an API client?"**
Requests is a low-level HTTP library -- I control every header, every retry. An API client (like the Twitter SDK) abstracts that away. For scraping, I need the low-level control because there's no official API.

## Get Started

```bash
# Clone the repo
git clone https://github.com/tolani007/ScrapingFBREF.git
cd ScrapingFBREF

# Install dependencies
pip install -r requirements.txt

# Run the scraper directly
python fbref_scraper.py

# Or launch the Flask web UI
python app.py
# Then open http://localhost:5000 in your browser

# Or explore the notebooks
jupyter notebook SUPERFBREFSCRAPER.ipynb
```

## How This Connects

This is the **foundation** of my sports analytics pipeline. The data I scrape here flows directly into my [EPL-WinPredictor](https://github.com/tolani007/EPL-WinPredictor) project, where I engineer features and train ML models. Think of it this way: ScrapingFBREF is the kitchen where I source and prep the ingredients. EPL-WinPredictor is where I cook the meal. You can't have one without the other. My [dribbling analysis](https://github.com/tolani007/epl-dribbling-analysis) and [goalscoring analysis](https://github.com/tolani007/epl-goalscoring-analysis) projects also depend on clean, well-structured data -- the kind this scraper produces.
