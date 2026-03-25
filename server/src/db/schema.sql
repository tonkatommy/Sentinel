-- Sentinel Database Schema

-- Users (security officers and standard users)
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  service_number TEXT UNIQUE NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('officer', 'standard')),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keys
CREATE TABLE IF NOT EXISTS keys (
  id          SERIAL PRIMARY KEY,
  key_number  TEXT UNIQUE NOT NULL,
  label       TEXT NOT NULL,
  location    TEXT,
  status      TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'issued')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Key authorisations — who is allowed to hold a given key
CREATE TABLE IF NOT EXISTS key_authorisations (
  key_id       INTEGER REFERENCES keys(id) ON DELETE CASCADE,
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (key_id, user_id)
);

-- Key transactions — every issue and return
CREATE TABLE IF NOT EXISTS audit_log (
  id             SERIAL PRIMARY KEY,
  key_id         INTEGER REFERENCES keys(id),
  user_id        INTEGER REFERENCES users(id),       -- who took/returned the key
  officer_id     INTEGER REFERENCES users(id),       -- officer who authorised
  action         TEXT NOT NULL CHECK (action IN ('issue', 'return')),
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_key_id    ON audit_log(key_id);
CREATE INDEX IF NOT EXISTS idx_audit_user_id   ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created   ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_keys_status     ON keys(status);
