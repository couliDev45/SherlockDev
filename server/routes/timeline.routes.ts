import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db.ts';
import { requireAdmin } from '../middleware/auth.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';

const router = Router();

function rowToTimeline(row: any) {
  return {
    id: row.id,
    year: row.year,
    title: row.title,
    description: row.description,
    tags: row.tags ?? [],
    align: row.align,
    badgeColor: row.badge_color ?? undefined,
  };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'SELECT * FROM timeline_events ORDER BY position DESC, created_at DESC'
    );
    res.json(rows.map(rowToTimeline));
  })
);

const timelineSchema = z.object({
  year: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  align: z.enum(['left', 'right']),
  badgeColor: z.string().optional(),
});

router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = timelineSchema.parse(req.body);

    const { rows: maxPos } = await pool.query(
      'SELECT COALESCE(MAX(position), 0) AS max FROM timeline_events'
    );
    const position = Number(maxPos[0].max) + 1;

    const { rows } = await pool.query(
      `INSERT INTO timeline_events (year, title, description, tags, align, badge_color, position)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [data.year, data.title, data.description, data.tags, data.align, data.badgeColor ?? null, position]
    );

    res.status(201).json(rowToTimeline(rows[0]));
  })
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Identifiant invalide.' });

    const { rowCount } = await pool.query('DELETE FROM timeline_events WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Événement introuvable.' });
    res.status(204).send();
  })
);

export default router;
