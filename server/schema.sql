-- Schéma PostgreSQL du portfolio CouliDev
-- Exécuter via : npm run db:migrate

-- Extension utile pour générer des UUID côté base si besoin plus tard
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Table profile : une seule ligne (id fixe = 1), contient les infos du profil
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile (
  id            SMALLINT PRIMARY KEY DEFAULT 1,
  name          TEXT NOT NULL,
  title         TEXT NOT NULL,
  subtitle      TEXT NOT NULL,
  bio           TEXT NOT NULL,
  short_bio     TEXT NOT NULL,
  email         TEXT NOT NULL,
  location      TEXT NOT NULL,
  status        TEXT NOT NULL,
  github_url    TEXT NOT NULL,
  linkedin_url  TEXT NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT profile_singleton CHECK (id = 1)
);

-- ---------------------------------------------------------------------------
-- Table assets : une seule ligne (id fixe = 1), logo / avatar / CV / carte
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assets (
  id            SMALLINT PRIMARY KEY DEFAULT 1,
  logo          TEXT NOT NULL,
  avatar        TEXT NOT NULL,
  map_paris     TEXT NOT NULL,
  cv_url        TEXT NOT NULL,
  cv_file_name  TEXT NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT assets_singleton CHECK (id = 1)
);

-- ---------------------------------------------------------------------------
-- Table projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  year              TEXT NOT NULL,
  category          TEXT NOT NULL CHECK (category IN ('React', 'Node.js', 'UI/UX', 'Mobile', 'Backend')),
  description       TEXT NOT NULL,
  long_description  TEXT NOT NULL,
  image             TEXT NOT NULL,
  alt               TEXT NOT NULL,
  tags              TEXT[] NOT NULL DEFAULT '{}',
  featured          BOOLEAN NOT NULL DEFAULT false,
  demo_url          TEXT,
  github_url        TEXT,
  metrics           JSONB NOT NULL DEFAULT '[]',
  position          INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Table timeline_events (Parcours)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_events (
  id            SERIAL PRIMARY KEY,
  year          TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  tags          TEXT[] NOT NULL DEFAULT '{}',
  align         TEXT NOT NULL CHECK (align IN ('left', 'right')),
  badge_color   TEXT,
  position      INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Table contact_messages : messages reçus via le formulaire de contact
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id            SERIAL PRIMARY KEY,
  nom           TEXT NOT NULL,
  email         TEXT NOT NULL,
  sujet         TEXT NOT NULL,
  message       TEXT NOT NULL,
  is_read       BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_position ON projects (position DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_position ON timeline_events (position DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages (created_at DESC);
