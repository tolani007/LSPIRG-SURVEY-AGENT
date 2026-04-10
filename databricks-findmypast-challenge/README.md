# FindMyPast UK — Databricks Data Engineering Challenge

> **Origin:** [FindMyPast recruitment test](https://github.com/findmypast/recruitment-test-data-engineering) — a real take-home assessment for data engineering roles, adapted here for Databricks + PySpark.

## The Problem (In Plain English)

You have two CSV files:

- **places.csv** — 113 cities in Scotland and Northern Ireland, with their county and country
- **people.csv** — 10,000 people, each with a name, birthday, and the city they were born in

**Your job:** Figure out how many people were born in each country and write the answer as JSON.

The answer should look like this:
```json
{"Scotland": 8048, "Northern Ireland": 1952}
```

That's it. But the *how* is what matters — schema design, data ingestion, transformation, validation.

---

## How I'd Explain This to a 5-Year-Old (Feynman Style)

Imagine you have a big box of 10,000 cards. Each card has someone's name and the city they were born in — like "John, Glasgow" or "Grace, Belfast."

You also have a cheat sheet that tells you which country each city is in: Glasgow is in Scotland, Belfast is in Northern Ireland.

You want to sort the cards into two piles — Scotland and Northern Ireland — and count each pile.

**The smart way:** Instead of writing "Scotland" on every Glasgow card (and every Edinburgh card, and every Dundee card...), you just give Glasgow a number — say, 53. Then every person born in Glasgow just has the number 53 on their card. When you need the country, you look up 53 on the cheat sheet. That's normalization.

---

## Project Structure

```
databricks-findmypast-challenge/
├── data/
│   ├── places.csv              ← 113 cities (the cheat sheet)
│   ├── people.csv              ← 10,000 birth records (the cards)
│   └── generate_people.py      ← Script that creates people.csv
├── notebooks/
│   ├── 00_explore_raw_data.py  ← Step 0: Profile the data before designing anything
│   ├── 01_schema_design.py     ← Step 1: Create normalized Delta tables
│   ├── 02_ingest_data.py       ← Step 2: Load CSVs → transform → write to Delta
│   └── 03_generate_summary.py  ← Step 3: JOIN + GROUP BY → JSON output
├── sql/
│   └── schema.sql              ← Pure SQL reference (works on Databricks & MySQL)
└── README.md                   ← You are here
```

**Run order:** 00 → 01 → 02 → 03 (each notebook builds on the previous)

---

## How to Run This in Databricks

### 1. Upload the data files
Upload `places.csv` and `people.csv` to DBFS:
```
/FileStore/findmypast/places.csv
/FileStore/findmypast/people.csv
```

### 2. Import the notebooks
Import all four `.py` files from `notebooks/` into your Databricks workspace. They use the `# Databricks notebook source` format and will be recognized automatically.

### 3. Run in order
- **00** — Explores the raw CSVs (row counts, nulls, cardinality, join validation)
- **01** — Creates the `findmypast` database and empty Delta tables
- **02** — Ingests CSVs into the tables (adds PKs, resolves FK, casts dates)
- **03** — Runs the aggregation and writes `summary_output.json`

### 4. Verify
The output at `/FileStore/findmypast/summary_output.json` should contain:
```json
{"Scotland": 8048, "Northern Ireland": 1952}
```

---

## Key Design Decisions (Interview Talking Points)

### 1. "Why did you normalize?"
> The raw data has the city name as a string on every person row. I created a `places` dimension table with a surrogate key (`place_id`) and linked people to it via `place_of_birth_id`. This eliminates redundancy — "Lanarkshire, Scotland" is stored once, not 800 times — and enforces referential integrity.

### 2. "Why surrogate keys instead of natural keys?"
> City names can have encoding variations or change over time. A numeric `place_id` is deterministic, compact (4 bytes vs variable-length string), and faster for joins.

### 3. "Why load dimensions before facts?"
> The fact table (`people`) needs `place_id` values from the dimension table (`places`). So I load `places` first, then join during the `people` ingestion step to resolve city names into foreign key IDs.

### 4. "Why Delta format?"
> Delta Lake gives ACID transactions, schema enforcement, and time travel. If a pipeline run fails halfway through, I can roll back. If someone asks "what did the data look like yesterday?" — I can time-travel query it. These are table stakes for production data engineering.

### 5. "How did you validate the pipeline?"
> Three checkpoints: (1) null checks on raw data before schema design, (2) row count comparison before and after FK resolution to catch data loss, (3) final assertion that Scotland + Northern Ireland = 10,000.

### 6. "Why `to_date()` instead of keeping strings?"
> Storing dates as strings means parsing them every time you query. Casting to DATE during ingestion is a one-time cost that enables native date functions — filtering by range, extracting year/decade, comparisons — without runtime parsing overhead.

---

## Skills Demonstrated

| Skill | Where |
|-------|-------|
| Data profiling & EDA | Notebook 00 |
| Schema design (normalization, surrogate keys, FKs) | Notebook 01, `schema.sql` |
| PySpark DataFrame API | Notebooks 02, 03 |
| Spark SQL | Notebooks 01, 02, 03 |
| Delta Lake table management | Notebooks 01, 02 |
| ETL pattern (read → transform → validate → write) | Notebook 02 |
| Data validation (null checks, row counts, assertions) | Notebooks 00, 02, 03 |
| JSON output generation | Notebook 03 |
| Both SQL and PySpark for the same logic | Notebook 03 |

---

## What the Interview Pairing Would Look Like

The challenge says the 90-minute pairing session includes modifications. Here's what they'd likely ask and how you'd handle it:

| They ask... | You do... |
|-------------|-----------|
| "Add a query for births per county" | `GROUP BY county, country` — Notebook 03 Bonus A |
| "Top 10 cities by births" | `GROUP BY city ORDER BY count DESC LIMIT 10` — Bonus B |
| "Output as CSV instead of JSON" | `.coalesce(1).write.csv()` — Bonus E |
| "Birth count by decade" | `FLOOR(YEAR(dob)/10)*10` — Bonus C |
| "Most popular name per country" | Window function with `ROW_NUMBER()` — Bonus D |

All five bonus queries are already implemented in Notebook 03.
