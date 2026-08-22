import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { pool } from '../db.ts';
import { requireAdmin } from '../middleware/auth.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';
import { sendContactNotification } from '../mailer.ts';
import { notifyNewContactMessage } from '../telegram.ts';

const router = Router();

const contactSchema = z.object({
  nom: z.string().trim().min(1, 'Le nom est requis.').max(200),
  email: z.string().trim().email('Adresse e-mail invalide.'),
  sujet: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1, 'Le message est requis.').max(5000),
});

// Anti-spam : 5 messages / 10 min / IP
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de messages envoyés. Merci de réessayer un peu plus tard.' },
});

router.post(
  '/',
  contactLimiter,
  asyncHandler(async (req, res) => {
    const data = contactSchema.parse(req.body);
    // NB : on reconstruit un objet litteral (plutot que de repasser `data`
    // directement) pour contourner un souci d'inference de types de Zod 3.25
    // ou le type du retour de .parse() perd sa precision sur l'objet global,
    // alors que chaque propriete individuelle reste bien typee `string`.
    const nom = data.nom;
    const email = data.email;
    const sujet = data.sujet;
    const message = data.message;

    const { rows } = await pool.query(
      `INSERT INTO contact_messages (nom, email, sujet, message)
       VALUES ($1,$2,$3,$4) RETURNING id, created_at`,
      [nom, email, sujet, message]
    );

    // L'échec d'envoi d'e-mail/Telegram ne doit jamais faire échouer la
    // requête : le message est déjà stocké en base et consultable via l'admin.
    sendContactNotification({ nom, email, sujet, message }).catch((err) => {
      console.error('[contact] Échec envoi e-mail de notification :', err);
    });
    notifyNewContactMessage({ nom, email, sujet, message }).catch((err) => {
      console.error('[contact] Échec envoi notification Telegram :', err);
    });

    res.status(201).json({ ok: true, id: rows[0].id, createdAt: rows[0].created_at });
  })
);

router.get(
  '/',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'SELECT id, nom, email, sujet, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 200'
    );
    res.json(rows);
  })
);

router.patch(
  '/:id/read',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Identifiant invalide.' });

    const { rows } = await pool.query(
      'UPDATE contact_messages SET is_read = true WHERE id = $1 RETURNING id',
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Message introuvable.' });
    res.json({ ok: true });
  })
);

export default router;
