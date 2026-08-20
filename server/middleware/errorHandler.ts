import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

// Wrapper pour éviter les try/catch répétés dans chaque route async.
export function asyncHandler<T extends (req: Request, res: Response, next: NextFunction) => Promise<unknown>>(
  fn: T
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Données invalides.',
      details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }

  console.error('[error]', err);
  const message = err instanceof Error ? err.message : 'Erreur interne du serveur.';
  return res.status(500).json({ error: message });
}
