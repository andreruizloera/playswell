import { pool } from '../config/database'
import { config } from 'dotenv'

config()

const SQL = `
-- Card metadata cache (from Pokemon TCG API, Rebrickable, etc.)
CREATE TABLE IF NOT EXISTS card_cache (
  id            TEXT PRIMARY KEY,           -- e.g. "base1-4", "lego-75257-1"
  category      TEXT NOT NULL,              -- pokemon | lego | baseball | basketball | mtg | hot-wheels | comics | vintage-toys
  card_name     TEXT NOT NULL,
  set_name      TEXT NOT NULL,
  card_number   TEXT,
  rarity        TEXT,
  image_url     TEXT,
  extra         JSONB DEFAULT '{}',         -- raw API data
  fetched_at    TIMESTAMPTZ DEFAULT NOW(),
  INDEX_hint    TEXT                        -- used internally for search
);

CREATE INDEX IF NOT EXISTS card_cache_category ON card_cache(category);
CREATE INDEX IF NOT EXISTS card_cache_name      ON card_cache(LOWER(card_name));

-- Listings (approved, visible to buyers)
CREATE TABLE IF NOT EXISTS listings (
  id            SERIAL PRIMARY KEY,
  card_id       TEXT REFERENCES card_cache(id) ON DELETE SET NULL,
  -- denormalized for speed / fallback when no card_id
  card_name     TEXT NOT NULL,
  set_name      TEXT NOT NULL,
  card_number   TEXT,
  category      TEXT NOT NULL,
  image_url     TEXT,
  price         NUMERIC(12,2) NOT NULL CHECK (price > 0),
  condition     TEXT NOT NULL,
  seller_name   TEXT NOT NULL,
  seller_email  TEXT NOT NULL,
  description   TEXT,
  tags          TEXT[] DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','sold','removed')),
  listed_at     TIMESTAMPTZ DEFAULT NOW(),
  sold_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS listings_status   ON listings(status);
CREATE INDEX IF NOT EXISTS listings_card_name ON listings(LOWER(card_name));
CREATE INDEX IF NOT EXISTS listings_price    ON listings(price);

-- Submissions (from the Submit page — pending review)
CREATE TABLE IF NOT EXISTS submissions (
  id            SERIAL PRIMARY KEY,
  card_id       TEXT,                       -- set after card lookup
  card_name     TEXT NOT NULL,
  set_name      TEXT,
  card_number   TEXT,
  category      TEXT NOT NULL,
  condition     TEXT NOT NULL,
  asking_price  NUMERIC(12,2) NOT NULL CHECK (asking_price > 0),
  description   TEXT,
  seller_name   TEXT NOT NULL,
  seller_email  TEXT NOT NULL,
  paypal_email  TEXT,
  image_urls    TEXT[] DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewer_note TEXT,
  submitted_at  TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS submissions_email  ON submissions(seller_email);

-- Fee log (every completed sale)
CREATE TABLE IF NOT EXISTS fee_log (
  id              SERIAL PRIMARY KEY,
  listing_id      INTEGER REFERENCES listings(id),
  sale_price      NUMERIC(12,2) NOT NULL,
  platform_fee    NUMERIC(12,2) NOT NULL,
  cause_amount    NUMERIC(12,2) NOT NULL,   -- 60% to Ben
  ops_amount      NUMERIC(12,2) NOT NULL,   -- 40% ops
  seller_payout   NUMERIC(12,2) NOT NULL,
  logged_at       TIMESTAMPTZ DEFAULT NOW()
);
`

async function migrate() {
  console.log('Running PlaysWell migrations...')
  try {
    await pool.query(SQL)
    console.log('Migrations complete.')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

migrate()
