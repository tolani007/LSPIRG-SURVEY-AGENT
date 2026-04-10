# Databricks notebook source

# MAGIC %md
# MAGIC # Step 2 — Ingest CSV Data into Delta Tables
# MAGIC
# MAGIC **WHAT THIS NOTEBOOK DOES:**
# MAGIC 1. Reads the raw CSVs from DBFS
# MAGIC 2. Adds surrogate keys (place_id, person_id)
# MAGIC 3. Resolves the FK relationship (city name → place_id)
# MAGIC 4. Writes clean, typed data into the Delta tables we created in Notebook 01
# MAGIC
# MAGIC **Interview talking point:** "My ingestion follows a clear pattern: read raw,
# MAGIC validate, transform, then write to the target table. I load the dimension table
# MAGIC first because the fact table needs those IDs for its foreign key."

# COMMAND ----------

# MAGIC %sql
# MAGIC USE findmypast;

# COMMAND ----------

# MAGIC %md
# MAGIC ## 2.1 — Define file paths

# COMMAND ----------

PLACES_PATH = "/FileStore/findmypast/places.csv"
PEOPLE_PATH = "/FileStore/findmypast/people.csv"

# COMMAND ----------

# MAGIC %md
# MAGIC ## 2.2 — Ingest places (dimension table first)
# MAGIC
# MAGIC **Why dimension first?** Because people needs `place_id` values that come from
# MAGIC places. You always load your lookup/dimension tables before your fact tables.
# MAGIC
# MAGIC **Key technique:** `monotonically_increasing_id()` generates unique IDs across
# MAGIC partitions. It's not sequential (1, 2, 3...) — it's guaranteed unique but may
# MAGIC have gaps. For a surrogate key, that's perfectly fine.

# COMMAND ----------

from pyspark.sql.functions import monotonically_increasing_id

# Read raw CSV
places_raw = (
    spark.read
    .option("header", "true")
    .option("encoding", "UTF-8")
    .csv(PLACES_PATH)
)

# Add surrogate key
places_with_id = places_raw.withColumn("place_id", monotonically_increasing_id())

# Reorder columns to match our table schema
places_final = places_with_id.select("place_id", "city", "county", "country")

print(f"Places to load: {places_final.count()} rows")
display(places_final.limit(10))

# COMMAND ----------

# MAGIC %md
# MAGIC ### Write places to Delta table
# MAGIC
# MAGIC `mode("overwrite")` replaces all existing data. For an initial load this is
# MAGIC correct. In production, you'd use `merge` (upsert) for incremental loads.

# COMMAND ----------

places_final.write.mode("overwrite").saveAsTable("findmypast.places")

print("places table loaded successfully")

# COMMAND ----------

# MAGIC %sql
# MAGIC -- Quick validation: do we have 113 rows?
# MAGIC SELECT COUNT(*) AS place_count FROM findmypast.places;

# COMMAND ----------

# MAGIC %sql
# MAGIC -- Spot check: how many cities per country?
# MAGIC SELECT country, COUNT(*) AS city_count
# MAGIC FROM findmypast.places
# MAGIC GROUP BY country
# MAGIC ORDER BY country;

# COMMAND ----------

# MAGIC %md
# MAGIC ## 2.3 — Ingest people (fact table)
# MAGIC
# MAGIC This is the interesting part. The raw CSV has `place_of_birth` as a city name
# MAGIC (e.g., "Glasgow"). Our schema expects `place_of_birth_id` as an integer FK.
# MAGIC
# MAGIC **The transformation:** JOIN people → places on city name, grab the `place_id`,
# MAGIC then drop the raw city column.
# MAGIC
# MAGIC **Interview talking point:** "During ingestion, I resolve the string-based
# MAGIC relationship into a numeric foreign key. This is a common ETL pattern —
# MAGIC denormalized source data gets normalized during the load step."

# COMMAND ----------

from pyspark.sql.functions import monotonically_increasing_id, col, to_date

# Read raw CSV
people_raw = (
    spark.read
    .option("header", "true")
    .option("encoding", "UTF-8")
    .csv(PEOPLE_PATH)
)

print(f"People rows in CSV: {people_raw.count()}")
display(people_raw.limit(5))

# COMMAND ----------

# MAGIC %md
# MAGIC ### 2.3.1 — Cast date_of_birth from string to DATE
# MAGIC
# MAGIC The CSV stores dates as strings like "1842-09-30". We need proper DATE type
# MAGIC for any date-based queries. `to_date()` handles ISO 8601 format natively.

# COMMAND ----------

people_typed = people_raw.withColumn(
    "date_of_birth",
    to_date(col("date_of_birth"), "yyyy-MM-dd")
)

# Verify no dates failed to parse (would show as null)
null_dates = people_typed.filter(col("date_of_birth").isNull()).count()
print(f"Rows with unparseable dates: {null_dates}")

# COMMAND ----------

# MAGIC %md
# MAGIC ### 2.3.2 — Resolve city names to place_id (the FK lookup)
# MAGIC
# MAGIC This is the core ETL transformation:
# MAGIC 1. Read the places table we just loaded (it has place_id ↔ city)
# MAGIC 2. JOIN people on `place_of_birth == city`
# MAGIC 3. Keep the `place_id` as `place_of_birth_id`
# MAGIC 4. Drop the raw city name (it lives in the places table now)

# COMMAND ----------

# Load the places lookup we just wrote
places_lookup = spark.table("findmypast.places").select("place_id", "city")

# Join to resolve city → place_id
people_resolved = (
    people_typed
    .join(
        places_lookup,
        people_typed["place_of_birth"] == places_lookup["city"],
        "inner"  # inner join: drop any people whose city isn't in places
    )
    .withColumnRenamed("place_id", "place_of_birth_id")
    .drop("place_of_birth", "city")  # drop the string columns — we have the ID now
)

# Add surrogate key
people_final = (
    people_resolved
    .withColumn("person_id", monotonically_increasing_id())
    .select("person_id", "given_name", "family_name", "date_of_birth", "place_of_birth_id")
)

print(f"People after FK resolution: {people_final.count()} rows")
display(people_final.limit(10))

# COMMAND ----------

# MAGIC %md
# MAGIC ### 2.3.3 — Validate before writing
# MAGIC
# MAGIC **Interview talking point:** "I always validate row counts before and after
# MAGIC transformation. If the input had 10,000 rows and the output has 9,800, I know
# MAGIC 200 rows had cities that didn't match — and I need to investigate."

# COMMAND ----------

input_count = people_raw.count()
output_count = people_final.count()
dropped = input_count - output_count

print(f"Input rows:   {input_count}")
print(f"Output rows:  {output_count}")
print(f"Dropped rows: {dropped}")

if dropped > 0:
    print(f"\n⚠ WARNING: {dropped} rows dropped during FK resolution!")
    print("These people had birth cities not found in places.csv")
else:
    print("\nAll rows matched — no data loss during ingestion")

# COMMAND ----------

# MAGIC %md
# MAGIC ### 2.3.4 — Write people to Delta table

# COMMAND ----------

people_final.write.mode("overwrite").saveAsTable("findmypast.people")

print("people table loaded successfully")

# COMMAND ----------

# MAGIC %sql
# MAGIC -- Final validation: row count
# MAGIC SELECT COUNT(*) AS people_count FROM findmypast.people;

# COMMAND ----------

# MAGIC %sql
# MAGIC -- Spot check: sample of joined data to verify FK works
# MAGIC SELECT
# MAGIC     p.person_id,
# MAGIC     p.given_name,
# MAGIC     p.family_name,
# MAGIC     p.date_of_birth,
# MAGIC     pl.city,
# MAGIC     pl.county,
# MAGIC     pl.country
# MAGIC FROM findmypast.people p
# MAGIC JOIN findmypast.places pl ON p.place_of_birth_id = pl.place_id
# MAGIC LIMIT 10;

# COMMAND ----------

# MAGIC %md
# MAGIC ## Ingestion complete
# MAGIC
# MAGIC **What we did:**
# MAGIC 1. Loaded 113 places (dimension) with surrogate keys
# MAGIC 2. Loaded 10,000 people (fact) with:
# MAGIC    - String dates cast to proper DATE type
# MAGIC    - City names resolved to numeric FK (`place_of_birth_id`)
# MAGIC    - Surrogate primary key (`person_id`)
# MAGIC 3. Validated zero data loss during the join
# MAGIC
# MAGIC **Next:** Notebook 03 — Generate the summary JSON output
