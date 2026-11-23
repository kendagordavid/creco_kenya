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
  review_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submission_files (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions (id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS submission_files_submission_id_idx ON submission_files (submission_id);

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

CREATE TABLE IF NOT EXISTS anonymous_reports (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('system', 'other')),
  subject TEXT NOT NULL,
  details TEXT NOT NULL,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'received' CHECK (
    status IN ('received', 'under_review', 'resolved', 'closed')
  ),
  staff_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS anonymous_reports_created_at_idx ON anonymous_reports (created_at DESC);

CREATE TABLE IF NOT EXISTS user_data (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  data_key TEXT NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, data_key)
);

CREATE INDEX IF NOT EXISTS user_data_updated_at_idx ON user_data (updated_at DESC);

CREATE TABLE IF NOT EXISTS news_posts (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (
    category IN ('legislative', 'regulation', 'court', 'guidance', 'other')
  ),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ NOT NULL,
  title_en TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  body_en TEXT NOT NULL,
  title_sw TEXT,
  summary_sw TEXT,
  body_sw TEXT,
  image_data BYTEA,
  image_content_type TEXT,
  author_user_id TEXT REFERENCES users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS news_posts_published_at_idx ON news_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS news_posts_published_idx ON news_posts (published, published_at DESC);

-- Staff console: user management and MFA
ALTER TABLE users ADD COLUMN IF NOT EXISTS disabled_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_pending_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_last_step BIGINT;

-- Staff console: Q&A flag review queue
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'open';
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS staff_note TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS reviewed_by TEXT REFERENCES users (id) ON DELETE SET NULL;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Staff console: knowledge CMS. A row replaces the built-in copy of one topic or FAQ in one language.
CREATE TABLE IF NOT EXISTS content_overrides (
  kind TEXT NOT NULL CHECK (kind IN ('topic', 'faq')),
  slug TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'sw')),
  title TEXT NOT NULL,
  lead TEXT,
  body TEXT NOT NULL,
  updated_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (kind, slug, locale)
);

-- Visitor statistics: one row per public page view. No cookies are set. visitor_id is a
-- keyed hash of the IP address, browser and date, so it changes every day and a visitor
-- cannot be followed from one day to the next. The IP address itself is never stored.
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  path TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  referrer_host TEXT
);

CREATE INDEX IF NOT EXISTS page_views_viewed_at_idx ON page_views (viewed_at DESC);
