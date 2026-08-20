import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { pool } from '../db.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const schemaPath = path.resolve(__dirname, '../schema.sql');
  const sql = readFileSync(schemaPath, 'utf-8');

  console.log('[migrate] Application de server/schema.sql...');
  await pool.query(sql);
  console.log('[migrate] Terminé avec succès.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('[migrate] Échec de la migration :', err);
  process.exit(1);
});
