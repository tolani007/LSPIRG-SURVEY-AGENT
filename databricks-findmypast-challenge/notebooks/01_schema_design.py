# Databricks notebook source

# MAGIC %md
# MAGIC # Step 1 — Schema Design (Normalized Delta Tables)
# MAGIC
# MAGIC **THE BIG IDEA:**
# MAGIC We're taking two flat CSV files and designing a *normalized* relational schema.
# MAGIC Instead of storing the full city/county/country string on every person row,
# MAGIC we store a numeric `place_id` that points to the places table.
# MAGIC
# MAGIC **Why normalize?**
# MAGIC - **No duplicated data** — "Lanarkshire, Scotland" is stored once, not 800+ times
# MAGIC - **Consistency** — update a county name in one place, not thousands
# MAGIC - **Referential integrity** — a person can't be born in a city that doesn't exist
# MAGIC - **Smaller storage** — an INT foreign key is 4 bytes vs repeating strings
# MAGIC
# MAGIC **Interview talking point:** "I chose a star-schema-style design: places is the
# MAGIC dimension table, people is the fact table. The FK from people to places enforces
# MAGIC data integrity and makes the country aggregation a simple JOIN + GROUP BY."

# COMMAND ----------

# MAGIC %md
# MAGIC ## 1.1 — Create the database (schema)
# MAGIC
# MAGIC In Databricks, a "database" is really a "schema" inside a catalog.
# MAGIC We create a dedicated one so our tables don't collide with anything else.

# COMMAND ----------

# MAGIC %sql
# MAGIC CREATE DATABASE IF NOT EXISTS findmypast
# MAGIC COMMENT 'FindMyPast UK data engineering challenge — birth records from Scotland and Northern Ireland';

# COMMAND ----------

# MAGIC %sql
# MAGIC USE findmypast;

# COMMAND ----------

# MAGIC %md
# MAGIC ## 1.2 — Create the `places` dimension table
# MAGIC
# MAGIC **Design decisions:**
# MAGIC - `place_id` — synthetic primary key (BIGINT, auto-generated during ingestion)
# MAGIC - `city` — NOT NULL, unique within the dataset
# MAGIC - `county` — NOT NULL, the administrative region
# MAGIC - `country` — NOT NULL, either "Scotland" or "Northern Ireland"
# MAGIC - Delta format — gives us ACID transactions, time travel, schema enforcement
# MAGIC
# MAGIC **Interview talking point:** "I used a surrogate key (`place_id`) rather than
# MAGIC making `city` the primary key because city names can change or have encoding
# MAGIC variations. A numeric key is also faster for joins."

# COMMAND ----------

# MAGIC %sql
# MAGIC CREATE OR REPLACE TABLE findmypast.places (
# MAGIC     place_id    BIGINT       COMMENT 'Surrogate primary key',
# MAGIC     city        STRING NOT NULL  COMMENT 'City name — join key from people.place_of_birth',
# MAGIC     county      STRING NOT NULL  COMMENT 'Administrative county',
# MAGIC     country     STRING NOT NULL  COMMENT 'Country: Scotland or Northern Ireland'
# MAGIC )
# MAGIC USING DELTA
# MAGIC COMMENT 'Dimension table: 113 cities across Scotland and Northern Ireland';

# COMMAND ----------

# MAGIC %md
# MAGIC ## 1.3 — Create the `people` fact table
# MAGIC
# MAGIC **Design decisions:**
# MAGIC - `person_id` — surrogate key for each person
# MAGIC - `given_name`, `family_name` — kept as separate columns (already split in source)
# MAGIC - `date_of_birth` — DATE type, not STRING (enables date-based queries)
# MAGIC - `place_of_birth_id` — FK to `places.place_id` (this IS the normalization)
# MAGIC
# MAGIC **Why keep `date_of_birth` as DATE?** So you can do things like:
# MAGIC - "How many people born before 1900?" → `WHERE date_of_birth < '1900-01-01'`
# MAGIC - "Birth count by decade?" → easy with `year()` function
# MAGIC - Storing as STRING would mean parsing every time you query

# COMMAND ----------

# MAGIC %sql
# MAGIC CREATE OR REPLACE TABLE findmypast.people (
# MAGIC     person_id           BIGINT       COMMENT 'Surrogate primary key',
# MAGIC     given_name          STRING NOT NULL  COMMENT 'First name',
# MAGIC     family_name         STRING NOT NULL  COMMENT 'Last name / surname',
# MAGIC     date_of_birth       DATE   NOT NULL  COMMENT 'Birth date (ISO 8601)',
# MAGIC     place_of_birth_id   BIGINT NOT NULL  COMMENT 'FK → places.place_id'
# MAGIC )
# MAGIC USING DELTA
# MAGIC COMMENT 'Fact table: 10,000 birth records linked to places via place_of_birth_id';

# COMMAND ----------

# MAGIC %md
# MAGIC ## 1.4 — Verify the schema
# MAGIC
# MAGIC Always verify after creation. Trust but verify.

# COMMAND ----------

# MAGIC %sql
# MAGIC DESCRIBE TABLE EXTENDED findmypast.places;

# COMMAND ----------

# MAGIC %sql
# MAGIC DESCRIBE TABLE EXTENDED findmypast.people;

# COMMAND ----------

# MAGIC %md
# MAGIC ## 1.5 — Visual: How the tables relate
# MAGIC
# MAGIC ```
# MAGIC ┌─────────────────────────────────┐       ┌──────────────────────────────┐
# MAGIC │          people (fact)          │       │      places (dimension)      │
# MAGIC ├─────────────────────────────────┤       ├──────────────────────────────┤
# MAGIC │ person_id        BIGINT   PK    │       │ place_id    BIGINT   PK      │
# MAGIC │ given_name       STRING        │       │ city        STRING           │
# MAGIC │ family_name      STRING        │       │ county      STRING           │
# MAGIC │ date_of_birth    DATE          │       │ country     STRING           │
# MAGIC │ place_of_birth_id BIGINT  FK ──────────│                              │
# MAGIC └─────────────────────────────────┘       └──────────────────────────────┘
# MAGIC ```
# MAGIC
# MAGIC The FK relationship: `people.place_of_birth_id → places.place_id`
# MAGIC
# MAGIC **Next:** Notebook 02 — Ingest the CSV data into these tables
