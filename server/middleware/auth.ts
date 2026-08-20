import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env.ts';

export interface AuthedRequest extends Request {
  isAdmin?: boolean;
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;

  if (!token) {
    return res.status(401).json({ error: "Authentification requise. Connectez-vous à l'espace admin." });
  }

  try {
    jwt.verify(token, env.jwtSecret);
    req.isAdmin = true;
    next();
  } catch {
    return res.status(401).json({ error: 'Session admin invalide ou expirée. Reconnectez-vous.' });
  }
}
