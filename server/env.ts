import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(
      `[env] La variable d'environnement ${name} est requise. Copiez .env.example vers .env et renseignez-la.`
    );
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),

  databaseUrl: required('DATABASE_URL'),

  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',

  // Mot de passe admin en clair OU hash bcrypt (recommandé en production).
  // Si ADMIN_PASSWORD_HASH est défini, il est prioritaire sur ADMIN_PASSWORD.
  adminPassword: process.env.ADMIN_PASSWORD,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,

  // Origine(s) autorisée(s) pour CORS quand le frontend est hébergé séparément.
  // Exemple: "https://coulidev.fr,https://www.coulidev.fr"
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  // Configuration SMTP optionnelle pour l'envoi d'e-mails de notification
  // lors d'un nouveau message de contact. Si absente, les messages sont
  // simplement enregistrés en base de données.
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    to: process.env.CONTACT_EMAIL_TO,
  },
};

if (!env.adminPassword && !env.adminPasswordHash) {
  throw new Error(
    "[env] Définissez ADMIN_PASSWORD (dev) ou ADMIN_PASSWORD_HASH (prod, hash bcrypt) pour protéger l'admin."
  );
}
