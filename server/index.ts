import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './env.ts';
import { pingDatabase } from './db.ts';
import { errorHandler } from './middleware/errorHandler.ts';

import authRoutes from './routes/auth.routes.ts';
import profileRoutes from './routes/profile.routes.ts';
import assetsRoutes from './routes/assets.routes.ts';
import projectsRoutes from './routes/projects.routes.ts';
import timelineRoutes from './routes/timeline.routes.ts';
import contactRoutes from './routes/contact.routes.ts';
import { SKILL_CATEGORIES } from './data/staticSkills.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(
  helmet({
    // Le front est une SPA servie séparément côté build ; on désactive la CSP
    // stricte par défaut de helmet pour éviter de casser des styles inline
    // générés par Vite/Tailwind. À affiner si besoin en production.
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: env.corsOrigins.length > 0 ? env.corsOrigins : true,
    credentials: false,
  })
);

// 1mb suffit largement pour du texte + un CV encodé en base64 raisonnable.
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await pingDatabase();
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'degraded', db: 'unreachable' });
  }
});

// Contenu statique (skills) : pas de table dédiée, l'admin ne les édite pas.
app.get('/api/skills', (_req, res) => {
  res.json(SKILL_CATEGORIES);
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/contact', contactRoutes);

// Agrégat pratique pour le premier chargement du frontend (1 seul appel réseau).
app.get('/api/portfolio', async (_req, res, next) => {
  try {
    const { pool } = await import('./db.ts');
    const [profileRes, assetsRes, projectsRes, timelineRes] = await Promise.all([
      pool.query('SELECT * FROM profile WHERE id = 1'),
      pool.query('SELECT * FROM assets WHERE id = 1'),
      pool.query('SELECT * FROM projects ORDER BY position DESC, created_at DESC'),
      pool.query('SELECT * FROM timeline_events ORDER BY position DESC, created_at DESC'),
    ]);

    if (!profileRes.rows[0] || !assetsRes.rows[0]) {
      return res.status(404).json({ error: 'Base non initialisée. Lancez npm run db:migrate puis npm run db:seed.' });
    }

    const p = profileRes.rows[0];
    const a = assetsRes.rows[0];

    res.json({
      profile: {
        name: p.name,
        title: p.title,
        subtitle: p.subtitle,
        bio: p.bio,
        shortBio: p.short_bio,
        email: p.email,
        location: p.location,
        status: p.status,
        githubUrl: p.github_url,
        linkedinUrl: p.linkedin_url,
      },
      assets: {
        logo: a.logo,
        avatar: a.avatar,
        mapParis: a.map_paris,
        cvUrl: a.cv_url,
        cvFileName: a.cv_file_name,
      },
      projects: projectsRes.rows.map((row) => ({
        id: row.id,
        title: row.title,
        year: row.year,
        category: row.category,
        description: row.description,
        longDescription: row.long_description,
        image: row.image,
        alt: row.alt,
        tags: row.tags ?? [],
        featured: row.featured,
        demoUrl: row.demo_url ?? undefined,
        githubUrl: row.github_url ?? undefined,
        metrics: row.metrics ?? [],
      })),
      timeline: timelineRes.rows.map((row) => ({
        id: row.id,
        year: row.year,
        title: row.title,
        description: row.description,
        tags: row.tags ?? [],
        align: row.align,
        badgeColor: row.badge_color ?? undefined,
      })),
      skills: SKILL_CATEGORIES,
    });
  } catch (err) {
    next(err);
  }
});

// En production, un seul service Node sert à la fois l'API et le build
// statique du frontend (dist/). Pratique pour un déploiement simple sur
// Render / Railway / Fly.io / VPS. Si le frontend est hébergé séparément
// (ex: Vercel), cette partie est simplement ignorée par ce dernier.
if (env.nodeEnv === 'production') {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`[server] API démarrée sur http://localhost:${env.port} (${env.nodeEnv})`);
});
