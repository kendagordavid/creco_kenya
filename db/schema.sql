CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  org_name TEXT NOT NULL,
  org_type TEXT,
  county TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'pbo_user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('registration', 'enabling', 'incident')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'under_review', 'approved', 'rejected')
  ),
  county TEXT NOT NULL,
  narrative TEXT NOT NULL,
  issue_type TEXT,
  severity TEXT,
  experience_date TEXT,
  org_type TEXT,
  consent_given BOOLEAN NOT NULL,
  attachment_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS submissions_user_id_idx ON submissions (user_id);
CREATE INDEX IF NOT EXISTS submissions_created_at_idx ON submissions (created_at DESC);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users (id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON feedback (created_at DESC);

CREATE TABLE IF NOT EXISTS user_data (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  data_key TEXT NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, data_key)
);

CREATE INDEX IF NOT EXISTS user_data_updated_at_idx ON user_data (updated_at DESC);
