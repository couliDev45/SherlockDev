import { pool } from '../db.ts';
import {
  DEFAULT_PROFILE,
  DEFAULT_ASSETS,
  DEFAULT_PROJECTS,
  DEFAULT_TIMELINE_EVENTS,
} from '../../src/data/portfolioData.ts';

async function seed() {
  console.log('[seed] Insertion des données par défaut...');

  await pool.query(
    `INSERT INTO profile (id, name, title, subtitle, bio, short_bio, email, location, status, github_url, linkedin_url)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name, title = EXCLUDED.title, subtitle = EXCLUDED.subtitle,
       bio = EXCLUDED.bio, short_bio = EXCLUDED.short_bio, email = EXCLUDED.email,
       location = EXCLUDED.location, status = EXCLUDED.status,
       github_url = EXCLUDED.github_url, linkedin_url = EXCLUDED.linkedin_url,
       updated_at = now()`,
    [
      DEFAULT_PROFILE.name,
      DEFAULT_PROFILE.title,
      DEFAULT_PROFILE.subtitle,
      DEFAULT_PROFILE.bio,
      DEFAULT_PROFILE.shortBio,
      DEFAULT_PROFILE.email,
      DEFAULT_PROFILE.location,
      DEFAULT_PROFILE.status,
      DEFAULT_PROFILE.githubUrl,
      DEFAULT_PROFILE.linkedinUrl,
    ]
  );

  await pool.query(
    `INSERT INTO assets (id, logo, avatar, map_paris, cv_url, cv_file_name)
     VALUES (1, $1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       logo = EXCLUDED.logo, avatar = EXCLUDED.avatar, map_paris = EXCLUDED.map_paris,
       cv_url = EXCLUDED.cv_url, cv_file_name = EXCLUDED.cv_file_name, updated_at = now()`,
    [
      DEFAULT_ASSETS.logo,
      DEFAULT_ASSETS.avatar,
      DEFAULT_ASSETS.mapParis,
      DEFAULT_ASSETS.cvUrl,
      DEFAULT_ASSETS.cvFileName,
    ]
  );

  await pool.query('DELETE FROM projects');
  for (let i = 0; i < DEFAULT_PROJECTS.length; i++) {
    const p = DEFAULT_PROJECTS[i];
    await pool.query(
      `INSERT INTO projects
        (id, title, year, category, description, long_description, image, alt, tags, featured, demo_url, github_url, metrics, position)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        p.id,
        p.title,
        p.year,
        p.category,
        p.description,
        p.longDescription,
        p.image,
        p.alt,
        p.tags,
        !!p.featured,
        p.demoUrl ?? null,
        p.githubUrl ?? null,
        JSON.stringify(p.metrics ?? []),
        DEFAULT_PROJECTS.length - i,
      ]
    );
  }

  await pool.query('DELETE FROM timeline_events');
  for (let i = 0; i < DEFAULT_TIMELINE_EVENTS.length; i++) {
    const t = DEFAULT_TIMELINE_EVENTS[i];
    await pool.query(
      `INSERT INTO timeline_events (year, title, description, tags, align, badge_color, position)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        t.year,
        t.title,
        t.description,
        t.tags,
        t.align,
        t.badgeColor ?? null,
        DEFAULT_TIMELINE_EVENTS.length - i,
      ]
    );
  }

  console.log('[seed] Terminé avec succès.');
  await pool.end();
}

seed().catch((err) => {
  console.error('[seed] Échec du seed :', err);
  process.exit(1);
});
