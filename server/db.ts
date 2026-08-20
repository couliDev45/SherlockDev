import { Pool } from 'pg';
import { env } from './env.ts';

// Certains hébergeurs (Render, Railway, Neon, Supabase...) exigent SSL.
// On l'active automatiquement sauf en local (localhost / 127.0.0.1).
const isLocalDb = /localhost|127\.0\.0\.1/.test(env.databaseUrl);

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: isLocalDb ? undefined : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  console.error('[db] Erreur inattendue sur une connexion PostgreSQL inactive', err);
});

export async function pingDatabase(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}
