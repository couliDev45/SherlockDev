import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db.ts';
import { requireAdmin } from '../middleware/auth.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';

const router = Router();

function rowToProfile(row: any) {
  return {
    name: row.name,
    title: row.title,
    subtitle: row.subtitle,
    bio: row.bio,
    shortBio: row.short_bio,
    email: row.email,
    location: row.location,
    status: row.status,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
  };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query('SELECT * FROM profile WHERE id = 1');
    if (!rows[0]) return res.status(404).json({ error: 'Profil non initialisé. Lancez npm run db:seed.' });
    res.json(rowToProfile(rows[0]));
  })
);

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  subtitle: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  shortBio: z.string().min(1).optional(),
  email: z.string().email().optional(),
  location: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
});

router.put(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = profileSchema.parse(req.body);

    const { rows: existingRows } = await pool.query('SELECT * FROM profile WHERE id = 1');
    const current = existingRows[0] ? rowToProfile(existingRows[0]) : null;
    if (!current) return res.status(404).json({ error: 'Profil non initialisé. Lancez npm run db:seed.' });

    const merged = { ...current, ...data };

    const { rows } = await pool.query(
      `UPDATE profile SET
         name = $1, title = $2, subtitle = $3, bio = $4, short_bio = $5,
         email = $6, location = $7, status = $8, github_url = $9, linkedin_url = $10,
         updated_at = now()
       WHERE id = 1 RETURNING *`,
      [
        merged.name,
        merged.title,
        merged.subtitle,
        merged.bio,
        merged.shortBio,
        merged.email,
        merged.location,
        merged.status,
        merged.githubUrl,
        merged.linkedinUrl,
      ]
    );

    res.json(rowToProfile(rows[0]));
  })
);

export default router;
