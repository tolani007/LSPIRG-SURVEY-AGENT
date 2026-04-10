# Databricks notebook source

# MAGIC %md
# MAGIC # Step 0 — Explore the Raw Data
# MAGIC
# MAGIC **WHY THIS STEP MATTERS:**
# MAGIC Before you write a single line of schema code, you need to *look* at the data.
# MAGIC Every data engineer who skips this step pays for it later — wrong types, missing
# MAGIC values they didn't expect, encoding issues that blow up at 2 AM.
# MAGIC
# MAGIC **Interview talking point:** "The first thing I always do is profile the raw data.
# MAGIC I check row counts, column types, null patterns, cardinality, and encoding before
# MAGIC I commit to a schema design. It takes 10 minutes and saves hours of rework."

# COMMAND ----------

# MAGIC %md
# MAGIC ## 0.1 — Upload CSVs to Databricks
# MAGIC
# MAGIC Before running this notebook:
# MAGIC 1. Upload `places.csv` and `people.csv` to DBFS at `/FileStore/findmypast/`
# MAGIC 2. Or use Unity Catalog Volumes: `/Volumes/<catalog>/<schema>/findmypast/`
# MAGIC
# MAGIC We'll use DBFS paths below — adjust if you're using Volumes.

# COMMAND ----------

# Define file paths — change these if you uploaded elsewhere
PLACES_PATH = "/FileStore/findmypast/places.csv"
PEOPLE_PATH = "/FileStore/findmypast/people.csv"

# COMMAND ----------

# MAGIC %md
# MAGIC ## 0.2 — Read the CSVs into DataFrames
# MAGIC
# MAGIC Key PySpark options to know:
# MAGIC - `header=True` → first row is column names, not data
# MAGIC - `inferSchema=True` → Spark guesses types (fine for exploration, not for production)
# MAGIC - `encoding=UTF-8` → the challenge warns about multi-byte characters

# COMMAND ----------

# Read places.csv
places_raw = (
    spark.read
    .option("header", "true")
    .option("inferSchema", "true")
    .option("encoding", "UTF-8")
    .csv(PLACES_PATH)
)

# Read people.csv
people_raw = (
    spark.read
    .option("header", "true")
    .option("inferSchema", "true")
    .option("encoding", "UTF-8")
    .csv(PEOPLE_PATH)
)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 0.3 — Basic Profiling: What shape is the data?

# COMMAND ----------

print(f"places.csv  → {places_raw.count()} rows, {len(places_raw.columns)} columns")
print(f"people.csv  → {people_raw.count()} rows, {len(people_raw.columns)} columns")

# COMMAND ----------

# What columns do we have? What types did Spark infer?
print("=== PLACES SCHEMA ===")
places_raw.printSchema()

print("\n=== PEOPLE SCHEMA ===")
people_raw.printSchema()

# COMMAND ----------

# MAGIC %md
# MAGIC ## 0.4 — Eyeball a sample
# MAGIC
# MAGIC Always look at actual rows. Schema tells you the structure; data tells you the story.

# COMMAND ----------

display(places_raw.limit(10))

# COMMAND ----------

display(people_raw.limit(10))

# COMMAND ----------

# MAGIC %md
# MAGIC ## 0.5 — Check for nulls and data quality
# MAGIC
# MAGIC **Interview talking point:** "I always check for nulls before designing constraints.
# MAGIC If a column has nulls in the source, I need to decide — reject those rows, default
# MAGIC them, or make the column nullable in my schema."

# COMMAND ----------

from pyspark.sql.functions import col, count, when, countDistinct

# Null check for places
print("=== PLACES — Null counts per column ===")
places_raw.select([
    count(when(col(c).isNull(), c)).alias(c) for c in places_raw.columns
]).show()

# Null check for people
print("=== PEOPLE — Null counts per column ===")
people_raw.select([
    count(when(col(c).isNull(), c)).alias(c) for c in people_raw.columns
]).show()

# COMMAND ----------

# MAGIC %md
# MAGIC ## 0.6 — Cardinality: How many unique values?
# MAGIC
# MAGIC This tells you what's a good candidate for normalization (low cardinality = lookup table).

# COMMAND ----------

print("=== PLACES — Distinct value counts ===")
places_raw.select([
    countDistinct(col(c)).alias(c) for c in places_raw.columns
]).show()

print("=== PEOPLE — Distinct value counts ===")
people_raw.select([
    countDistinct(col(c)).alias(c) for c in people_raw.columns
]).show()

# COMMAND ----------

# MAGIC %md
# MAGIC ## 0.7 — The key relationship: Do all birth cities exist in places?
# MAGIC
# MAGIC This is the *most important* check before you design a foreign key.
# MAGIC If people have birth cities that don't exist in places, your FK will reject rows.

# COMMAND ----------

from pyspark.sql.functions import col

# Cities in people that are NOT in places
orphan_cities = (
    people_raw.select("place_of_birth").distinct()
    .join(
        places_raw.select("city").distinct(),
        people_raw["place_of_birth"] == places_raw["city"],
        "left_anti"  # keep only rows from left that have NO match on right
    )
)

orphan_count = orphan_cities.count()
print(f"Birth cities with no match in places.csv: {orphan_count}")

if orphan_count > 0:
    print("These cities would break a foreign key constraint:")
    display(orphan_cities)
else:
    print("All birth cities have a match — safe to create a foreign key.")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 0.8 — Country distribution (preview of our final output)
# MAGIC
# MAGIC Let's see what the answer *should* be before we build the pipeline.
# MAGIC This gives us a target to validate against.

# COMMAND ----------

from pyspark.sql.functions import col

# Join people → places on city, then count by country
preview = (
    people_raw
    .join(places_raw, people_raw["place_of_birth"] == places_raw["city"], "inner")
    .groupBy("country")
    .count()
    .orderBy("country")
)

display(preview)

# COMMAND ----------

# MAGIC %md
# MAGIC ## Key Takeaways for Schema Design
# MAGIC
# MAGIC After running this notebook you should know:
# MAGIC 1. **places** has 3 columns, 113 rows, 2 countries — it's a lookup/dimension table
# MAGIC 2. **people** has 4 columns, 10,000 rows — it's the fact table
# MAGIC 3. The join key is `people.place_of_birth == places.city`
# MAGIC 4. All birth cities exist in places (no orphans) — FK is safe
# MAGIC 5. `date_of_birth` came in as string — we'll cast it to DATE in ingestion
# MAGIC 6. Expected output: `{"Scotland": 8048, "Northern Ireland": 1952}`
# MAGIC
# MAGIC **Next:** Notebook 01 — Design the normalized schema
