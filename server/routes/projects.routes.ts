import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db.ts';
import { requireAdmin } from '../middleware/auth.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';

const router = Router();

function rowToProject(row: any) {
  return {
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
  };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'SELECT * FROM projects ORDER BY position DESC, created_at DESC'
    );
    res.json(rows.map(rowToProject));
  })
);

const categoryEnum = z.enum(['React', 'Node.js', 'UI/UX', 'Mobile', 'Backend']);

const metricSchema = z.object({ label: z.string(), value: z.string() });

const projectCreateSchema = z.object({
  title: z.string().min(1),
  year: z.string().min(1),
  category: categoryEnum,
  description: z.string().min(1),
  longDescription: z.string().min(1),
  image: z.string().min(1),
  alt: z.string().min(1),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().optional().default(false),
  demoUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  metrics: z.array(metricSchema).optional().default([]),
});

const projectUpdateSchema = projectCreateSchema.partial();

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'projet'
  );
}

router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = projectCreateSchema.parse(req.body);

    const baseId = slugify(data.title);
    let id = baseId;
    let suffix = 1;
    // Garantit un id unique en base même si deux projets portent un titre proche
    while (true) {
      const { rows } = await pool.query('SELECT 1 FROM projects WHERE id = $1', [id]);
      if (rows.length === 0) break;
      id = `${baseId}-${++suffix}`;
    }

    const { rows: maxPos } = await pool.query('SELECT COALESCE(MAX(position), 0) AS max FROM projects');
    const position = Number(maxPos[0].max) + 1;

    const { rows } = await pool.query(
      `INSERT INTO projects
        (id, title, year, category, description, long_description, image, alt, tags, featured, demo_url, github_url, metrics, position)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        id,
        data.title,
        data.year,
        data.category,
        data.description,
        data.longDescription,
        data.image,
        data.alt,
        data.tags,
        data.featured,
        data.demoUrl ?? null,
        data.githubUrl ?? null,
        JSON.stringify(data.metrics),
        position,
      ]
    );

    res.status(201).json(rowToProject(rows[0]));
  })
);

router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = projectUpdateSchema.parse(req.body);

    const { rows: existingRows } = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (!existingRows[0]) return res.status(404).json({ error: 'Projet introuvable.' });

    const current = rowToProject(existingRows[0]);
    const merged = { ...current, ...data };

    const { rows } = await pool.query(
      `UPDATE projects SET
         title=$1, year=$2, category=$3, description=$4, long_description=$5, image=$6, alt=$7,
         tags=$8, featured=$9, demo_url=$10, github_url=$11, metrics=$12, updated_at=now()
       WHERE id = $13 RETURNING *`,
      [
        merged.title,
        merged.year,
        merged.category,
        merged.description,
        merged.longDescription,
        merged.image,
        merged.alt,
        merged.tags,
        merged.featured,
        merged.demoUrl ?? null,
        merged.githubUrl ?? null,
        JSON.stringify(merged.metrics ?? []),
        id,
      ]
    );

    res.json(rowToProject(rows[0]));
  })
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Projet introuvable.' });
    res.status(204).send();
  })
);

export default router;
