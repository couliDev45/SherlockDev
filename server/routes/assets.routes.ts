import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db.ts';
import { requireAdmin } from '../middleware/auth.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';

const router = Router();

function rowToAssets(row: any) {
  return {
    logo: row.logo,
    avatar: row.avatar,
    mapParis: row.map_paris,
    cvUrl: row.cv_url,
    cvFileName: row.cv_file_name,
  };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query('SELECT * FROM assets WHERE id = 1');
    if (!rows[0]) return res.status(404).json({ error: 'Assets non initialisés. Lancez npm run db:seed.' });
    res.json(rowToAssets(rows[0]));
  })
);

// Note : cvUrl accepte soit une URL http(s), soit une data URL (base64) envoyée
// par le formulaire d'upload de CV côté admin. La limite de taille du body
// JSON est augmentée dans server/index.ts pour supporter les petits PDF.
const assetsSchema = z.object({
  logo: z.string().min(1).optional(),
  avatar: z.string().min(1).optional(),
  mapParis: z.string().min(1).optional(),
  cvUrl: z.string().min(1).optional(),
  cvFileName: z.string().min(1).optional(),
});

router.put(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = assetsSchema.parse(req.body);

    const { rows: existingRows } = await pool.query('SELECT * FROM assets WHERE id = 1');
    const current = existingRows[0] ? rowToAssets(existingRows[0]) : null;
    if (!current) return res.status(404).json({ error: 'Assets non initialisés. Lancez npm run db:seed.' });

    const merged = { ...current, ...data };

    const { rows } = await pool.query(
      `UPDATE assets SET
         logo = $1, avatar = $2, map_paris = $3, cv_url = $4, cv_file_name = $5, updated_at = now()
       WHERE id = 1 RETURNING *`,
      [merged.logo, merged.avatar, merged.mapParis, merged.cvUrl, merged.cvFileName]
    );

    res.json(rowToAssets(rows[0]));
  })
);

export default router;
