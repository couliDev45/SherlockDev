import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { notifyServerError } from '../telegram.ts';

// Wrapper pour éviter les try/catch répétés dans chaque route async.
export function asyncHandler<T extends (req: Request, res: Response, next: NextFunction) => Promise<unknown>>(
  fn: T
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Données invalides.',
      details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }

  console.error('[error]', err);
  const message = err instanceof Error ? err.message : 'Erreur interne du serveur.';

  // Uniquement pour les vraies erreurs serveur (bugs), pas les erreurs de
  // validation ci-dessus qui sont attendues et sans intérêt en notification.
  notifyServerError({ method: req.method, path: req.path, message }).catch(() => {
    // Ne jamais faire échouer la réponse à cause d'un souci de notification.
  });

  return res.status(500).json({ error: message });
}
