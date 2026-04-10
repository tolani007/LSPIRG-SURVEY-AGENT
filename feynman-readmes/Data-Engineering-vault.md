# Data Engineering Vault
> My personal battle-tested collection of data engineering challenges -- the problems that taught me how data actually moves through the real world.

## What I Built (and Why You Should Care)

I built this vault because I kept running into the same frustrating pattern: data engineering interviews ask you to design pipelines and model data, but most learning resources give you toy examples that fall apart the moment you meet messy, real-world data. So I started collecting real challenges -- from Brazilian retail analytics to healthcare data to credit risk scoring -- and solving them end to end, documenting every decision along the way.

Think of this repo as my data engineering gym. Each folder is a different workout targeting a different muscle group. The Boticario challenge forced me to think about retail data at scale in a Brazilian market context. The Home Credit risk engine taught me how financial institutions actually think about default prediction. The Privia Health challenge showed me the unique constraints of healthcare data (hello, HIPAA considerations and irregular time series). The Prospa ETL challenge was pure pipeline craftsmanship. And the Gordon Food Service drill? That was my speed round -- solving a data problem under pressure, exactly the way you would in an actual interview.

What makes this vault different from a textbook is that every solution here came from a problem that somebody in industry actually needed solved. These are not contrived exercises. They are the kinds of problems that show up on your desk on a Tuesday morning and need to be working by Friday. The stack is deliberately practical: Python, Jupyter Notebooks for exploration, and enough HTML/CSS to present results cleanly. No fancy frameworks for the sake of it. Just solid engineering.

## The Core Concepts - Explained Simply

### ETL Pipelines (Extract, Transform, Load)
Imagine you are moving apartments. First, you **extract** everything from the old place -- boxes, furniture, random junk drawers. Then you **transform** -- you sort through it all, throw away what is broken, organize what is left, maybe assemble some new furniture. Finally, you **load** it into the new apartment in the right rooms. That is ETL. Every single challenge in this vault follows that pattern. Data comes in messy and scattered, and my job is to deliver it clean, structured, and useful. The art is in the Transform step -- that is where domain knowledge lives, and that is where junior engineers most often stumble.

### Data Modeling
Data modeling is like designing the floor plan before you build the house. If you get the schema wrong -- if you put the bathroom where the kitchen should be -- everything downstream breaks. In the Home Credit risk engine, I had to decide: do I model loan applications as a flat table or a star schema with dimension tables for applicant demographics, loan terms, and payment history? The answer depends on who is querying it, how fast they need results, and whether storage cost matters. That decision-making process -- weighing trade-offs out loud -- is exactly what interviewers want to see.

### Data Quality
Here is a truth that took me a while to learn: the pipeline that moves data is only as good as the data it moves. Garbage in, garbage out. Data quality means asking the hard questions up front. Are there nulls where there should not be? Are dates formatted consistently? Does a "quantity" column contain negative numbers that make no sense? In the Boticario challenge, I had to deal with Brazilian formatting conventions -- commas for decimals, dots for thousands separators -- and if I had not caught that early, every downstream calculation would have been silently wrong. I build quality gates at every stage: schema validation on ingest, null and range checks during transformation, row-count reconciliation after load.

### Domain-Specific Challenges
Each challenge in this vault lives in a different industry, and that is intentional. Healthcare data (Privia) has strict privacy rules, irregular timestamps, and codes like ICD-10 that mean nothing until you map them. Retail data (Boticario) has seasonality, promotions, and inventory cycles. Finance data (Home Credit) has risk scores, default rates, and regulatory reporting requirements. Understanding the domain is half the battle in data engineering. You do not need to be a doctor to work with healthcare data, but you do need to ask the right questions fast.

### SQL as a First-Class Citizen
I treat SQL the way a carpenter treats a hammer -- it is the tool I reach for first, and I can do a surprising amount with just that. Window functions, CTEs, self-joins, pivoting -- these are not just syntax tricks. They are how you answer real business questions without spinning up a Spark cluster. Several challenges here are SQL-heavy because that is the reality of data engineering work. Even when I write Python, I think in SQL first.

### Idempotency
This concept tripped me up early on, so let me save you the pain. An idempotent pipeline produces the same result whether you run it once or ten times. Why does that matter? Because pipelines fail. Servers crash. Network connections drop. And when you hit "retry," you do not want your pipeline to insert duplicate rows. I design for idempotency by using upserts (insert-or-update), partitioning loads by date, and making each run self-contained. Think of it like a light switch -- flipping it once or five times still results in the light being on.

## How It Actually Works - Step by Step

1. **Pick a challenge folder.** Each one is self-contained with its own data, notebooks, and solution code.
2. **Read the problem statement.** I include context about the business domain and what the "customer" (interviewer or stakeholder) actually needs.
3. **Boticario BR Challenge:** I ingested Brazilian retail transaction data, cleaned it (dealing with locale-specific formatting), built a dimensional model, and produced business-ready aggregations. Think: "How many units of product X sold in region Y last quarter?"
4. **Home Credit Risk Engine:** This one is meaty. I took raw credit application data with dozens of supplementary tables, mapped entity relationships, identified the grain of each table, and engineered features (like "average days between payments") to produce a risk-scored dataset ready for ML.
5. **Privia Health Challenge:** Healthcare data with all its quirks -- ICD codes, provider hierarchies, patient encounters. I built transforms that respect the domain's complexity while keeping the output analyst-friendly.
6. **Prospa ETL Challenge:** Pure pipeline design. Extract from source, apply business rules, validate, and load into a target schema. I focused on idempotency and error handling -- the unglamorous skills that separate production-grade pipelines from notebook experiments.
7. **Gordon Food Service Notebook:** An analytical drill -- think of it as a timed exam. I explored the dataset, answered business questions, and documented insights, all in a single notebook under time pressure.

## What This Taught Me (And What It Will Teach You)

- **Pipeline thinking:** How to decompose any data problem into extract, transform, and load stages -- and why the order and error handling at each stage matters more than the code itself.
- **Schema design under constraints:** How to model data when you have competing requirements (fast writes vs. fast reads, normalization vs. query simplicity) and limited time. I learned to sketch a star schema on paper before writing a single line of code.
- **Domain translation:** How to take a vague business requirement like "we need to understand customer risk" and turn it into concrete tables, columns, and transformations.
- **Defensive coding:** Always validate row counts after joins. Always check for nulls before aggregating. Always log your assumptions. These habits saved me in every single challenge.
- **Notebook discipline:** Jupyter Notebooks can become a mess fast. I learned to structure them like a story: setup, exploration, transformation, validation, output.
- **Python for data engineering:** Using pandas for small data, SQL for medium data, PySpark for big data. Knowing when to reach for which tool is half the battle.
- **Interview fluency:** How to talk through a data engineering problem out loud, explaining trade-offs as you go -- which is exactly what a take-home challenge or whiteboard session demands.

## Interview Confidence Builder

**Q1: Walk me through how you would design an ETL pipeline for a retail company.**
Start with the source systems -- POS data, inventory feeds, maybe a CRM. Define your staging layer (raw ingestion, no transformations). Build transforms that create a clean, deduplicated, enriched dataset. Load into a warehouse with a star schema -- fact tables for transactions, dimension tables for products, stores, and time. Mention idempotency, logging, and monitoring. Reference my Boticario challenge as a concrete example.

**Q2: How do you handle data quality issues in a pipeline?**
I build quality gates at every stage: null checks, uniqueness constraints, referential integrity tests, and row-count validations before and after transforms. If a gate fails, the pipeline stops and alerts rather than loading bad data. Prevention beats cure. In the Boticario challenge, catching Brazilian number formatting early prevented silent calculation errors across the entire pipeline.

**Q3: Explain the difference between a star schema and a snowflake schema.**
Star schema: one fact table surrounded by denormalized dimension tables -- simple, fast for queries, easy to understand. Snowflake: dimensions are normalized into sub-dimensions -- saves storage, but queries get more complex with extra joins. I default to star for analytics workloads because query speed and simplicity matter more than disk space in most modern systems.

**Q4: How would you approach a credit risk dataset with dozens of tables?**
Map the entity relationships first. Identify the grain of each table (one row = one application? one payment? one bureau inquiry?). Then engineer features by aggregating child tables up to the application level -- things like "number of previous loans," "average payment delay," "total credit bureau inquiries." My Home Credit challenge is a worked example of exactly this process.

**Q5: What is idempotency and why does it matter in data pipelines?**
Idempotency means running the same pipeline twice produces the same result -- no duplicates, no side effects. It matters because pipelines fail and get rerun all the time. I ensure it by using upserts instead of blind inserts, partitioning loads by date, and designing each pipeline run to be self-contained.

**Q6: Tell me about a time you worked with healthcare data.**
Walk through the Privia Health challenge: clinical codes, provider hierarchies, patient encounters. Emphasize data sensitivity, proper handling of PII, and how domain-specific business rules (like ICD code groupings) drove my transform logic. Show that you understand the stakes -- bad healthcare data does not just break a dashboard, it can affect patient outcomes.

**Q7: How do you decide between Python and SQL for a transformation?**
If the logic is set-based (joins, aggregations, filters), SQL is almost always cleaner and faster. If it requires procedural logic, complex string parsing, API calls, or ML feature engineering, Python wins. I often prototype in SQL to validate my logic, then implement in Python when the complexity outgrows a single query.

**Q8: What do you do when a pipeline takes too long?**
Profile first -- find the bottleneck. Is it the extraction (slow source system)? Transformation (inefficient joins or lack of indexing)? Loading (write amplification)? Common fixes: add indexes, partition large tables, push filtering upstream, parallelize independent steps, or switch from pandas to PySpark for data that exceeds memory. Never optimize before you measure.

## Get Started

```bash
git clone https://github.com/tolani007/Data-Engineering-vault.git
cd Data-Engineering-vault

# Each challenge is a self-contained folder
ls  # boticario-br-challenge, home-credit-risk-engine, privia-health-challenge, prospa-etl-challenge

# Start with Prospa for pure pipeline fundamentals
cd prospa-etl-challenge
jupyter notebook

# Or dive into the Gordon Food Service drill for an interview simulation
jupyter notebook Gordon_Food_Service_Solution_drill.ipynb
```

Requirements vary by challenge, but you will generally need: Python 3.8+, Jupyter, pandas, and numpy. Check each folder for specifics.

## How This Connects

This vault is my **data engineering foundation** -- the roots of the tree that everything else branches from. The ETL patterns here feed directly into my **Fun Data Science Content** repo, where I take clean data and apply ML and deep learning. The feature engineering skills from the Home Credit challenge? Those same instincts power my **Instacart recommendation** and **customer behavior prediction** projects. The pipeline discipline I built here is exactly what I applied at scale in **Steeview**, where signal processing demands rock-solid data pipelines running in Rust at microsecond latency. And the domain-translation skills I sharpened across healthcare, retail, and finance? They made me comfortable diving into **agricultural AI** for the Cocoa Contamination project and **sustainability economics** for the Ghana Cocoa analysis. Start here if data engineering is new to you. Come back here when you need to sharpen your fundamentals.
