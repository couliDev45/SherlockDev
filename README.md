# CouliDev — Portfolio Développeur (Frontend + Backend)

Portfolio full-stack : frontend React/Vite + backend Node.js/Express/PostgreSQL.
Le tableau de bord admin (bouton "Admin" dans le header/footer) permet de modifier
le contenu du site (profil, projets, parcours, CV, images) directement depuis le
navigateur — les changements sont enregistrés en base de données et visibles par
tous les visiteurs, plus de `localStorage`.

## Stack

- **Frontend** : React 19, Vite 6, TailwindCSS 4, TypeScript
- **Backend** : Node.js, Express, PostgreSQL (via `pg`), JWT (auth admin), Zod (validation)
- **Formulaire de contact** : enregistré en base + notification e-mail optionnelle (SMTP)

## Prérequis

- Node.js 20+
- Une base PostgreSQL (locale, Docker, ou un service managé : Render, Railway, Supabase, Neon...)

## Installation

```bash
npm install
cp .env.example .env
```

Ouvrez `.env` et renseignez au minimum :
- `DATABASE_URL` — chaîne de connexion PostgreSQL
- `JWT_SECRET` — une valeur aléatoire longue (ex. `openssl rand -base64 32`)
- `ADMIN_PASSWORD` — le mot de passe de l'espace admin (en dev ; utilisez `ADMIN_PASSWORD_HASH` en prod, voir plus bas)

## Initialiser la base de données

```bash
npm run db:migrate   # crée les tables
npm run db:seed      # insère les données par défaut (profil, projets, parcours)
```

## Lancer en local (développement)

```bash
npm run dev
```

Cela démarre en parallèle :
- le frontend Vite sur `http://localhost:3000`
- l'API Express sur `http://localhost:4000`

Le frontend proxifie automatiquement `/api/*` vers le backend (voir `vite.config.ts`),
donc pas de configuration CORS à faire en local.

## Espace Admin

Cliquez sur "Admin" dans le header ou le footer du site, puis connectez-vous avec
le mot de passe défini dans `.env` (`ADMIN_PASSWORD`). Vous pouvez ensuite :
- Modifier le profil, l'avatar, le logo, le CV
- Ajouter / modifier / supprimer des projets
- Ajouter / supprimer des étapes du parcours
- Consulter les messages reçus via le formulaire de contact

## Build & déploiement en production

### Option A — Un seul service (le plus simple)

Le backend peut servir à la fois l'API **et** les fichiers statiques du frontend :

```bash
npm run build          # build du frontend -> dist/
npm run build:server   # build du backend  -> dist-server/
NODE_ENV=production npm start
```

Cela convient parfaitement à des hébergeurs comme **Render**, **Railway**, **Fly.io**
ou un VPS classique : un seul service Node à déployer, avec ces variables
d'environnement définies sur la plateforme :

- `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD_HASH` (voir ci-dessous), `NODE_ENV=production`
- Commande de build : `npm install && npm run build && npm run build:server`
- Commande de démarrage : `npm start`
- Après le premier déploiement, exécutez une fois `npm run db:migrate && npm run db:seed`
  (via un shell sur la plateforme, ou un "Job"/"Release command" selon l'hébergeur)

### Option B — Frontend et backend séparés

Si vous préférez héberger le frontend sur **Vercel/Netlify** et le backend
ailleurs (Render, Railway...) :

- Frontend : `npm run build`, déployez le dossier `dist/`. Définissez la variable
  `VITE_API_URL` avec l'URL publique du backend (ex. `https://mon-api.onrender.com`)
- Backend : déployez comme en option A (sans forcément servir le frontend),
  et définissez `CORS_ORIGINS` avec l'URL du frontend (ex. `https://moncv.vercel.app`)

### Mot de passe admin en production

Ne laissez jamais `ADMIN_PASSWORD` en clair en production. Générez un hash :

```bash
node -e "console.log(require('bcryptjs').hashSync('votre-mot-de-passe', 10))"
```

Mettez le résultat dans `ADMIN_PASSWORD_HASH` et laissez `ADMIN_PASSWORD` vide.

### Notification e-mail du formulaire de contact (optionnel)

Sans configuration SMTP, les messages sont simplement stockés en base et visibles
dans l'onglet "Messages" de l'admin. Pour recevoir aussi un e-mail à chaque
message, renseignez `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` et
`CONTACT_EMAIL_TO` dans les variables d'environnement.

## Scripts disponibles

| Commande              | Description                                          |
|------------------------|-------------------------------------------------------|
| `npm run dev`           | Frontend + backend en parallèle (développement)      |
| `npm run dev:client`    | Frontend seul (Vite)                                  |
| `npm run dev:server`    | Backend seul (avec rechargement à chaud)              |
| `npm run build`         | Build du frontend → `dist/`                           |
| `npm run build:server`  | Build du backend → `dist-server/`                     |
| `npm start`             | Démarre le backend compilé (sert aussi `dist/`)        |
| `npm run db:migrate`    | Applique le schéma SQL (`server/schema.sql`)          |
| `npm run db:seed`       | Insère les données par défaut en base                |
| `npm run lint`          | Vérification TypeScript (`tsc --noEmit`)              |

## Structure du projet

```
src/                  Frontend React
  components/          Composants UI (dont AdminDashboardModal.tsx)
  context/              PortfolioContext.tsx — état global, appels API
  lib/api.ts             Client API centralisé
  data/portfolioData.ts  Données par défaut (fallback si l'API est injoignable)

server/                Backend Express
  index.ts              Point d'entrée
  db.ts                 Connexion PostgreSQL
  env.ts                 Variables d'environnement
  schema.sql             Schéma de la base de données
  routes/                 Routes API (auth, profile, assets, projects, timeline, contact)
  middleware/             Auth JWT, gestion d'erreurs
  scripts/                Migration & seed
```
