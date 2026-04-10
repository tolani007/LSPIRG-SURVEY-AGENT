-- ============================================================================
-- FindMyPast UK — Normalized Schema for Birth Records
-- ============================================================================
-- This SQL is the "plain SQL" reference for the schema created in Notebook 01.
-- It works on both MySQL (the original challenge) and Databricks SQL.
--
-- DESIGN RATIONALE:
--   - Star schema: places = dimension, people = fact
--   - Surrogate keys on both tables (not natural keys)
--   - FK from people.place_of_birth_id → places.place_id
--   - Dates stored as DATE type (not STRING)
--   - All columns NOT NULL (source data has no nulls)
-- ============================================================================

-- ── Database ────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS findmypast
    COMMENT 'FindMyPast UK data engineering challenge';

USE findmypast;

-- ── Dimension: places ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS places (
    place_id    BIGINT       COMMENT 'Surrogate primary key',
    city        STRING NOT NULL  COMMENT 'City name (join key from people)',
    county      STRING NOT NULL  COMMENT 'Administrative county',
    country     STRING NOT NULL  COMMENT 'Scotland or Northern Ireland'
)
USING DELTA
COMMENT '113 cities across Scotland and Northern Ireland';

-- ── Fact: people ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS people (
    person_id           BIGINT       COMMENT 'Surrogate primary key',
    given_name          STRING NOT NULL  COMMENT 'First name',
    family_name         STRING NOT NULL  COMMENT 'Surname',
    date_of_birth       DATE   NOT NULL  COMMENT 'Birth date (ISO 8601)',
    place_of_birth_id   BIGINT NOT NULL  COMMENT 'FK → places.place_id'
)
USING DELTA
COMMENT '10,000 birth records linked to places';

-- ── The deliverable query ──────────────────────────────────────────────────

-- This produces the JSON output: {"Scotland": 8048, "Northern Ireland": 1952}

SELECT
    pl.country,
    COUNT(*) AS birth_count
FROM people p
JOIN places pl ON p.place_of_birth_id = pl.place_id
GROUP BY pl.country
ORDER BY pl.country;


-- ============================================================================
-- MYSQL VERSION (for the original Docker-based challenge)
-- ============================================================================
-- If you need to run this on MySQL instead of Databricks, use:
--
--   CREATE TABLE places (
--       place_id    INT AUTO_INCREMENT PRIMARY KEY,
--       city        VARCHAR(100) NOT NULL,
--       county      VARCHAR(100) NOT NULL,
--       country     VARCHAR(50) NOT NULL,
--       UNIQUE KEY idx_city (city)
--   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--
--   CREATE TABLE people (
--       person_id           INT AUTO_INCREMENT PRIMARY KEY,
--       given_name          VARCHAR(100) NOT NULL,
--       family_name         VARCHAR(100) NOT NULL,
--       date_of_birth       DATE NOT NULL,
--       place_of_birth_id   INT NOT NULL,
--       FOREIGN KEY (place_of_birth_id) REFERENCES places(place_id)
--   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- ============================================================================
