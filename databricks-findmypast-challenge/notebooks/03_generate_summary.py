# Databricks notebook source

# MAGIC %md
# MAGIC # Step 3 — Generate the Summary JSON Output
# MAGIC
# MAGIC **THE DELIVERABLE:**
# MAGIC A JSON file at `data/summary_output.json` containing the count of people
# MAGIC born in each country. Expected result:
# MAGIC ```json
# MAGIC {"Scotland": 8048, "Northern Ireland": 1952}
# MAGIC ```
# MAGIC
# MAGIC **Interview talking point:** "This is where the normalized schema pays off.
# MAGIC Because I separated places from people and linked them with a foreign key,
# MAGIC the country aggregation is a clean JOIN + GROUP BY — no string parsing,
# MAGIC no CASE statements, no guessing."

# COMMAND ----------

# MAGIC %sql
# MAGIC USE findmypast;

# COMMAND ----------

# MAGIC %md
# MAGIC ## 3.1 — The core query: births per country
# MAGIC
# MAGIC This is the SQL version first — the simplest way to express it.

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT
# MAGIC     pl.country,
# MAGIC     COUNT(*) AS birth_count
# MAGIC FROM findmypast.people p
# MAGIC JOIN findmypast.places pl ON p.place_of_birth_id = pl.place_id
# MAGIC GROUP BY pl.country
# MAGIC ORDER BY pl.country;

# COMMAND ----------

# MAGIC %md
# MAGIC ## 3.2 — Same query in PySpark (know both!)
# MAGIC
# MAGIC **Interview talking point:** "I'm comfortable expressing the same logic in both
# MAGIC SQL and PySpark. SQL is better for ad-hoc exploration; PySpark is better when
# MAGIC you need programmatic control — conditionals, loops, writing to external systems."

# COMMAND ----------

from pyspark.sql.functions import count

people = spark.table("findmypast.people")
places = spark.table("findmypast.places")

summary_df = (
    people
    .join(places, people["place_of_birth_id"] == places["place_id"])
    .groupBy("country")
    .agg(count("*").alias("birth_count"))
    .orderBy("country")
)

display(summary_df)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 3.3 — Convert to JSON and write the output file
# MAGIC
# MAGIC The expected format is `{"Scotland": 8048, "Northern Ireland": 1952}` —
# MAGIC a flat dictionary, NOT a list of objects. So we need to collect the DataFrame
# MAGIC to the driver and build the dict ourselves.
# MAGIC
# MAGIC **Why `.collect()` is OK here:** Our result is 2 rows (one per country).
# MAGIC Collecting tiny aggregation results to the driver is fine.
# MAGIC Never `.collect()` a million-row DataFrame — that kills the driver.

# COMMAND ----------

import json

# Collect the 2-row result to a Python dict
rows = summary_df.collect()
summary_dict = {row["country"]: row["birth_count"] for row in rows}

print("Summary dictionary:")
print(json.dumps(summary_dict, indent=2))

# COMMAND ----------

# MAGIC %md
# MAGIC ### Write to DBFS as JSON

# COMMAND ----------

output_path = "/FileStore/findmypast/summary_output.json"
json_string = json.dumps(summary_dict)

# Write using dbutils (Databricks utility)
dbutils.fs.put(output_path, json_string, overwrite=True)

print(f"Written to: {output_path}")

# COMMAND ----------

# MAGIC %md
# MAGIC ### Verify the output

# COMMAND ----------

# Read it back and confirm
result = dbutils.fs.head(output_path)
print(f"Contents of summary_output.json:\n{result}")

# Parse and validate
parsed = json.loads(result)
total = sum(parsed.values())
print(f"\nTotal people: {total}")
print(f"Scotland:         {parsed.get('Scotland', 0)}")
print(f"Northern Ireland: {parsed.get('Northern Ireland', 0)}")

assert total == 10000, f"Expected 10,000 total but got {total}"
print("\nValidation passed — output matches expected totals")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 3.4 — Bonus queries (interview pairing prep)
# MAGIC
# MAGIC The challenge says the interview includes "modifications to output code for
# MAGIC additional data subsets." Here are the kinds of queries they'd likely ask:

# COMMAND ----------

# MAGIC %md
# MAGIC ### Bonus A: Births per county

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT
# MAGIC     pl.county,
# MAGIC     pl.country,
# MAGIC     COUNT(*) AS birth_count
# MAGIC FROM findmypast.people p
# MAGIC JOIN findmypast.places pl ON p.place_of_birth_id = pl.place_id
# MAGIC GROUP BY pl.county, pl.country
# MAGIC ORDER BY birth_count DESC
# MAGIC LIMIT 15;

# COMMAND ----------

# MAGIC %md
# MAGIC ### Bonus B: Top 10 cities by birth count

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT
# MAGIC     pl.city,
# MAGIC     pl.country,
# MAGIC     COUNT(*) AS birth_count
# MAGIC FROM findmypast.people p
# MAGIC JOIN findmypast.places pl ON p.place_of_birth_id = pl.place_id
# MAGIC GROUP BY pl.city, pl.country
# MAGIC ORDER BY birth_count DESC
# MAGIC LIMIT 10;

# COMMAND ----------

# MAGIC %md
# MAGIC ### Bonus C: Birth count by decade

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT
# MAGIC     CONCAT(FLOOR(YEAR(p.date_of_birth) / 10) * 10, 's') AS decade,
# MAGIC     COUNT(*) AS birth_count
# MAGIC FROM findmypast.people p
# MAGIC GROUP BY FLOOR(YEAR(p.date_of_birth) / 10) * 10
# MAGIC ORDER BY decade;

# COMMAND ----------

# MAGIC %md
# MAGIC ### Bonus D: Most common names per country

# COMMAND ----------

# MAGIC %sql
# MAGIC WITH ranked_names AS (
# MAGIC     SELECT
# MAGIC         pl.country,
# MAGIC         p.given_name,
# MAGIC         COUNT(*) AS name_count,
# MAGIC         ROW_NUMBER() OVER (PARTITION BY pl.country ORDER BY COUNT(*) DESC) AS rank
# MAGIC     FROM findmypast.people p
# MAGIC     JOIN findmypast.places pl ON p.place_of_birth_id = pl.place_id
# MAGIC     GROUP BY pl.country, p.given_name
# MAGIC )
# MAGIC SELECT country, given_name, name_count
# MAGIC FROM ranked_names
# MAGIC WHERE rank <= 5
# MAGIC ORDER BY country, rank;

# COMMAND ----------

# MAGIC %md
# MAGIC ### Bonus E: Output as CSV (interview might ask for this format too)

# COMMAND ----------

# PySpark version — write CSV output
csv_summary = (
    people
    .join(places, people["place_of_birth_id"] == places["place_id"])
    .groupBy("country")
    .agg(count("*").alias("birth_count"))
    .orderBy("country")
)

csv_output_path = "/FileStore/findmypast/summary_output_csv"
csv_summary.coalesce(1).write.mode("overwrite").option("header", "true").csv(csv_output_path)

print(f"CSV written to: {csv_output_path}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## Pipeline Complete
# MAGIC
# MAGIC **What you built (end to end):**
# MAGIC
# MAGIC ```
# MAGIC places.csv ──→ [Read CSV] ──→ [Add PK] ──→ Delta: places (dimension)
# MAGIC                                                    │
# MAGIC people.csv ──→ [Read CSV] ──→ [Cast dates] ──→ [FK lookup] ──→ Delta: people (fact)
# MAGIC                                                    │
# MAGIC                                          [JOIN + GROUP BY]
# MAGIC                                                    │
# MAGIC                                                    ▼
# MAGIC                                        summary_output.json
# MAGIC                                   {"Scotland":8048,"Northern Ireland":1952}
# MAGIC ```
# MAGIC
# MAGIC **What you can confidently say in an interview:**
# MAGIC 1. "I profiled the raw data before designing anything"
# MAGIC 2. "I chose a normalized schema with surrogate keys and a foreign key relationship"
# MAGIC 3. "I loaded dimensions before facts to resolve FK references"
# MAGIC 4. "I validated row counts at every stage to catch data loss"
# MAGIC 5. "I cast string dates to proper DATE type for queryability"
# MAGIC 6. "I can express the same logic in both SQL and PySpark"
# MAGIC 7. "The final output is a simple collect + JSON write because the result is tiny"
