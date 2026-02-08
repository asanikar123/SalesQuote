-- Schema for SalesQuote
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS designations (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS rate_cards (
    id INTEGER PRIMARY KEY,
    designation_id INTEGER NOT NULL,
    region TEXT NOT NULL CHECK (region IN ('onshore', 'offshore')),
    hourly_rate NUMERIC NOT NULL CHECK (hourly_rate >= 0),
    monthly_rate NUMERIC NOT NULL CHECK (monthly_rate >= 0),
    FOREIGN KEY (designation_id) REFERENCES designations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY,
    client_metadata TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quote_line_items (
    id INTEGER PRIMARY KEY,
    quote_id INTEGER NOT NULL,
    designation_id INTEGER NOT NULL,
    region TEXT NOT NULL CHECK (region IN ('onshore', 'offshore')),
    hours NUMERIC NOT NULL CHECK (hours >= 0),
    monthly_rate NUMERIC NOT NULL CHECK (monthly_rate >= 0),
    line_total NUMERIC NOT NULL CHECK (line_total >= 0),
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (designation_id) REFERENCES designations(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_rate_cards_designation_region
    ON rate_cards (designation_id, region);

CREATE INDEX IF NOT EXISTS idx_quote_line_items_quote_id
    ON quote_line_items (quote_id);

CREATE INDEX IF NOT EXISTS idx_quote_line_items_designation_region
    ON quote_line_items (designation_id, region);
