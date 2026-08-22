import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { env } from '../env.ts';
import { asyncHandler } from '../middleware/errorHandler.ts';
import { notifyFailedAdminLogin } from '../telegram.ts';

const router = Router();

const loginSchema = z.object({
  password: z.string().min(1, 'Mot de passe requis.'),
});

// Anti-bruteforce : 10 tentatives / 15 min / IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives de connexion. Réessayez plus tard.' },
});

router.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { password } = loginSchema.parse(req.body);

    const isValid = env.adminPasswordHash
      ? await bcrypt.compare(password, env.adminPasswordHash)
      : password === env.adminPassword;

    if (!isValid) {
      notifyFailedAdminLogin(req.ip ?? 'IP inconnue').catch(() => {});
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign({ role: 'admin' }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });
    res.json({ token });
  })
);

export default router;
