# Architecture du Projet Vitall

> **Plateforme modulaire pour les services institutionnels** (Pompiers, Police, Hôpitaux, etc.)
>
> Projet de développement d'une suite d'applications modulaires destinée aux services d'intervention.
> Premier module développé : **Recrutement des pompiers volontaires**.

---

## Table des matières

- [Stack technique](#-stack-technique)
- [Structure du projet](#-structure-du-projet)
- [Installation & Démarrage](#-installation--démarrage)
- [Docker](#-docker)
- [Pipeline CI/CD](#-pipeline-cicd)
- [Sécurité & DevSecOps](#-sécurité--devsecops)
- [Authentification](#-authentification)
- [Modules fonctionnels](#-modules-fonctionnels)
- [Base de données](#-base-de-données)
- [Variables d'environnement](#-variables-denvironnement)
- [Comptes de test](#-comptes-de-test)
- [Design System & Figma](#-design-system--figma)
- [Scripts utiles](#-scripts-utiles)
- [Résolution de problèmes](#-résolution-de-problèmes)

---

## 🧩 Stack technique

| Domaine               | Technologie                                              |
| --------------------- | -------------------------------------------------------- |
| **Framework**         | Next.js 16 (App Router + Turbopack)                      |
| **Langage**           | TypeScript + React 19                                    |
| **Style**             | TailwindCSS v4 + Design system Figma                     |
| **UI Components**     | shadcn/ui                                                |
| **Auth**              | JWT (jose) + bcrypt, middleware Next.js                   |
| **Base de données**   | PostgreSQL 16 + Prisma ORM                               |
| **Paiement**          | Stripe (Checkout + Webhooks)                              |
| **Tests**             | Vitest + Testing Library                                  |
| **CI/CD**             | GitHub Actions                                            |
| **Qualité de code**   | ESLint + SonarQube                                        |
| **Sécurité**          | Snyk (Container Scan)                                     |
| **Conteneurisation**  | Docker (multi-stage, Alpine Linux)                        |
| **Déploiement**       | VPS via SSH (Dokploy)                                     |

---

## 📁 Structure du projet

```
vitall-solution/
├── .github/workflows/      # Pipeline CI/CD (GitHub Actions)
│   └── deploy.yml
├── prisma/                  # Schéma BDD, migrations et seed
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/                  # Assets statiques (fonts, images, icônes)
├── scripts/                 # Scripts utilitaires (création comptes de test)
├── src/
│   ├── app/                 # Routes Next.js (App Router)
│   │   ├── layout.tsx       # Layout racine
│   │   ├── page.tsx         # Page d'accueil
│   │   ├── login/           # Page de connexion
│   │   ├── account-setup/   # Flux d'inscription + paiement Stripe
│   │   ├── onboarding/      # Onboarding utilisateur
│   │   ├── admin/           # Dashboard Admin (RBAC)
│   │   ├── dashboard/       # Dashboard Utilisateur
│   │   ├── mentions-legales/
│   │   └── api/             # Routes API
│   │       ├── auth/        # Login, Logout, Auto-login
│   │       ├── stripe/      # Checkout, Webhook, Session
│   │       ├── health/      # Health check
│   │       └── account-setup/
│   ├── components/          # Composants UI (Design System)
│   │   ├── ui/              # Composants shadcn/ui
│   │   ├── onboarding/      # Composants d'onboarding
│   │   └── icons/           # Icônes custom
│   ├── context/             # React Contexts (AuthContext)
│   ├── hooks/               # Hooks React custom
│   ├── lib/                 # Clients & utilitaires (prisma, auth, utils)
│   ├── types/               # Types TypeScript globaux
│   └── __tests__/           # Tests unitaires
├── Dockerfile               # Image de production (multi-stage, Alpine)
├── Dockerfile.dev           # Image de développement
├── docker-compose.yml       # Orchestration production
├── compose.override.yml     # Surcharge développement
├── docker-entrypoint.sh     # Script de démarrage (migrations + serveur)
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── sonar-project.properties
```

---

## 🚀 Installation & Démarrage

### Prérequis

- Node.js 20+
- npm
- Docker & Docker Compose (pour l'environnement conteneurisé)

### Développement local (sans Docker)

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd vitall-solution

# 2. Configurer l'environnement
cp .env.example .env
# Remplir les variables (voir section "Variables d'environnement")

# 3. Installer les dépendances
npm install

# 4. Générer le client Prisma et appliquer le schéma
npx prisma generate
npx prisma db push

# 5. (Optionnel) Seed de la base de données
npx tsx prisma/seed.ts

# 6. Lancer le serveur de développement
npm run dev
# → http://localhost:3000
```

---

## 🐳 Docker

### Architecture des images

Le projet utilise un **build Docker multi-stage** pour optimiser la taille et la sécurité de l'image de production :

| Stage       | Image de base      | Rôle                                                                 |
| ----------- | ------------------ | -------------------------------------------------------------------- |
| **Builder** | `node:20-alpine`   | Installe les dépendances, compile le projet Next.js en mode standalone |
| **Runner**  | `node:20-alpine`   | Image finale légère, contient uniquement le build et Prisma CLI        |

**Choix d'Alpine Linux** : Contrairement à `node:20-slim` (Debian), Alpine présente **0 vulnérabilité critique** selon les scans Snyk. L'image est aussi significativement plus légère.

**Suppression de npm en production** : `npm` est supprimé de l'image finale pour éliminer sa surface d'attaque (vulnérabilités dans `cross-spawn`, `glob`, `minimatch`, `tar`). Seul le binaire `prisma` est conservé pour exécuter les migrations au démarrage.

### Démarrage rapide avec Docker

```bash
# 1. Configurer l'environnement
cp .env.example .env
# Remplir les variables Stripe

# 2. Lancer l'application (PostgreSQL + App)
docker compose up -d

# 3. Voir les logs
docker compose logs -f

# 4. Accéder à l'application
# → http://localhost:3000

# 5. Arrêter
docker compose down
```

### Développement avec Docker

Le fichier `compose.override.yml` surcharge automatiquement la config en mode développement :

```bash
# Lancer en mode dev (hot reload, volumes montés)
docker compose up -d
# Les fichiers locaux sont synchronisés via bind mount
```

### Commandes Docker utiles

```bash
# Rebuild après modification de code
docker compose up -d --build

# Entrer dans le conteneur
docker compose exec app sh

# Accéder à PostgreSQL
docker compose exec postgres psql -U vitall_user -d vitall_db

# Backup de la base
docker compose exec postgres pg_dump -U vitall_user vitall_db > backup.sql

# Restaurer
docker compose exec -T postgres psql -U vitall_user vitall_db < backup.sql

# Nettoyage complet (⚠️ perte de données)
docker compose down -v && docker system prune -a
```

---

## ⚙️ Pipeline CI/CD

Le pipeline GitHub Actions (`.github/workflows/deploy.yml`) est déclenché à chaque push sur `main` ou `develop`.

### Schéma du pipeline

```
┌──────────────────────────────────────────────────────────────────────┐
│                     Push sur main / develop                         │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
    ┌──────────────┐ ┌──────────┐ ┌──────────────┐
    │ 🏗️ Build,    │ │ 🧪 Tests │ │ 🔍 SonarQube │
    │ Scan & Push  │ │ unitaires│ │ Analysis     │
    │              │ │          │ │              │
    │ 1. Build img │ │ npm ci   │ │ Qualité code │
    │ 2. Snyk Scan │ │ vitest   │ │              │
    │ 3. Push GHCR │ │          │ │              │
    └──────┬───────┘ └────┬─────┘ └──────────────┘
           │              │
           └──────┬───────┘
                  ▼
        ┌──────────────────┐
        │ 🚢 Deploy to VPS │  (main uniquement)
        │                  │
        │ SSH → pull → up  │
        └──────────────────┘
```

### Jobs détaillés

#### 1. Build, Scan & Push (`build`)

1. **Checkout** du code source
2. **Login** au GitHub Container Registry (GHCR)
3. **Build local** de l'image Docker (sans push, pour le scan)
4. **Scan Snyk** de l'image — bloquant si vulnérabilités **High** ou **Critical**
5. **Push** de l'image sur `ghcr.io` si le scan est passé

#### 2. Tests unitaires (`tests`)

- Setup Node.js 20 avec cache npm
- `npm ci` puis `npm run test` (Vitest)

#### 3. Analyse de qualité (`quality`)

- Scan SonarQube (qualité du code, code smells, couverture)

#### 4. Déploiement (`deploy`)

- Uniquement sur la branche `main`
- Dépend du succès de `build` et `tests`
- Connexion SSH au VPS → `docker compose pull` → `docker compose up -d`

### Secrets GitHub requis

| Secret                    | Description                          |
| ------------------------- | ------------------------------------ |
| `SNYK_TOKEN`              | Token API Snyk (container scan)      |
| `SONAR_TOKEN`             | Token SonarQube                      |
| `SONAR_HOST_URL`          | URL de l'instance SonarQube          |
| `DEPLOY_HOST`             | IP/hostname du VPS                   |
| `DEPLOY_USER`             | Utilisateur SSH                      |
| `DEPLOY_KEY`              | Clé privée SSH                       |
| `DEPLOY_PORT`             | Port SSH                             |

---

## 🛡️ Sécurité & DevSecOps

### Pourquoi Snyk pour le Container Scanning ?

Dans le cadre de notre démarche **DevSecOps**, nous avons intégré **Snyk** comme scanner de vulnérabilités pour nos images Docker. Contrairement à des outils comme Trivy ou Docker Scout, Snyk se distingue par :

1. **Intelligence Contextuelle** : Snyk n'identifie pas seulement les vulnérabilités système (OS), mais analyse aussi les dépendances applicatives (`package.json`) et l'image de base Node.js.
2. **Aide à la remédiation** : Il propose des chemins de mise à jour concrets (ex: suggérer une image de base plus récente et moins vulnérable, ou upgrader un paquet npm spécifique) plutôt que de simples alertes.
3. **Filtrage par sévérité** : Notre pipeline est configuré avec `--severity-threshold=high` pour bloquer tout déploiement contenant des vulnérabilités de niveau **High** ou **Critical**, tout en laissant passer les Low/Medium.

Cette intégration applique le principe du **"Shift Left Security"** : la sécurité est vérifiée dès l'étape de build, avant même que l'image ne soit poussée sur le registre. Cela permet d'automatiser la sécurité sans ralentir le cycle de développement, en apportant des retours immédiats aux développeurs directement dans la CI.

### Mesures de sécurité appliquées

| Mesure                        | Détail                                                                    |
| ----------------------------- | ------------------------------------------------------------------------- |
| **Image de base Alpine**      | `node:20-alpine` — 0 vulnérabilité critique (vs 41 pour `node:20-slim`)  |
| **npm supprimé en production**| Élimine les vulnérabilités de `cross-spawn`, `glob`, `minimatch`, `tar`   |
| **Utilisateur non-root**      | Le conteneur tourne sous l'utilisateur `nextjs` (UID 1001)                |
| **Build multi-stage**         | L'image finale ne contient que le strict nécessaire (standalone)           |
| **Scan bloquant en CI**       | Aucune image vulnérable ne peut atteindre le registre ou la production     |
| **JWT httpOnly**              | Les tokens sont stockés dans des cookies httpOnly, secure en production    |
| **Mots de passe hashés**      | bcrypt avec 10 rounds de salage                                            |
| **Middleware RBAC**           | Protection des routes par rôle (ADMIN / USER) dans le middleware Next.js   |

### Génération du SNYK_TOKEN

1. Se connecter sur [app.snyk.io](https://app.snyk.io/)
2. **Account Settings** → **Auth Token** → Copier le token
3. Sur GitHub : **Settings** → **Secrets and variables** → **Actions** → Ajouter `SNYK_TOKEN`

---

## 🔐 Authentification

### Flux de création de compte (via paiement Stripe)

```
/account-setup (3 étapes : infos, modules, récapitulatif)
    ↓
POST /api/stripe/checkout → session Stripe Checkout
    ↓
Paiement Stripe (mode test)
    ↓
POST /api/stripe/webhook → confirmation
    ↓
Prisma Transaction :
  - Create Organization
  - Create User (bcrypt hash)
  - Create Subscription + Modules
    ↓
/account-setup/success → Auto-login (JWT)
    ↓
Redirection → /admin
```

### Flux de connexion

```
/login (formulaire email + mot de passe)
    ↓
POST /api/auth/login
  - bcrypt.compare(password, hash)
  - SignJWT (userId, email, role, organizationId)
  - Set cookie auth-token (httpOnly, 7 jours)
    ↓
Redirection selon le rôle :
  - ADMIN → /admin
  - USER  → /dashboard
```

### Rôles et permissions

| Fonctionnalité             | ADMIN | USER |
| -------------------------- | ----- | ---- |
| Accès `/admin`             | ✅     | ❌    |
| Accès `/dashboard`         | ✅     | ✅    |
| Gestion organisation       | ✅     | ❌    |
| Gestion modules            | ✅     | ❌    |
| Gestion utilisateurs       | ✅     | ❌    |
| Consultation profil        | ✅     | ✅    |
| Notifications              | ✅     | ✅    |

### Protection des routes (middleware)

| Route              | Règle                                         |
| ------------------ | --------------------------------------------- |
| `/login`           | Publique                                      |
| `/account-setup`   | Publique                                      |
| `/mentions-legales`| Publique                                      |
| `/api/stripe/webhook` | Publique (vérifié par signature Stripe)    |
| `/admin/*`         | JWT valide + rôle `ADMIN`                     |
| `/dashboard/*`     | JWT valide (USER ou ADMIN)                    |

### Déconnexion

`POST /api/auth/logout` → Suppression du cookie `auth-token` → Redirection `/login`

---

## 📦 Modules fonctionnels

L'application suit une architecture **modulaire** : chaque module est indépendant mais partage l'authentification et la base de données.

### Modules disponibles

| Catégorie       | Module           | Prix/mois |
| --------------- | ---------------- | --------- |
| **Base**        | Pack de base     | 270 €     |
| **RH**          | Recrutement      | 90 €      |
|                 | Paie             | 70 €      |
|                 | Planning         | 65 €      |
|                 | Congés           | 50 €      |
|                 | Signature        | 50 €      |
|                 | Formation        | 40 €      |
|                 | Employés         | 25 €      |
|                 | Entretien        | 20 €      |
| **Communication** | Rendez-vous    | 40 €      |
|                 | Email marketing  | 15 €      |
|                 | Chat interne     | 15 €      |
| **Gestion**     | Compta           | 60 €      |
|                 | Flottes          | 50 €      |
|                 | Matériel         | 45 €      |
|                 | Note de frais    | 32,90 €   |

### Modules prévus (roadmap)

- **Intervention** — planification et suivi des missions
- **Administration** — gestion interne, statistiques et documents

---

## 🗄️ Base de données

### Technologie

- **PostgreSQL 16** (Alpine) via Docker
- **Prisma ORM** pour les requêtes et migrations

### Modèles principaux

| Modèle                | Description                                  |
| --------------------- | -------------------------------------------- |
| `User`                | Utilisateurs (email, password, rôle)         |
| `Organization`        | Organisations clientes                       |
| `Subscription`        | Abonnement lié à une organisation            |
| `SubscriptionModule`  | Modules activés par abonnement               |
| `Module`              | Catalogue des modules disponibles            |
| `Candidature`         | Candidatures de recrutement                  |
| `Notification`        | Notifications utilisateur                    |

### Enums

- `UserRole` : `ADMIN`, `USER`
- `SubscriptionStatus` : `ACTIVE`, `INACTIVE`, `PENDING`, `CANCELLED`
- `CandidatureStatus` : `PENDING`, `INTERVIEW`, `ACCEPTED`, `REJECTED`
- `ShiftType` : `GARDE`, `ASTREINTE`, `FORMATION`, `REUNION`
- `LeaveStatus` : `PENDING`, `APPROVED`, `REJECTED`

### Commandes Prisma

```bash
npx prisma generate         # Générer le client
npx prisma db push          # Appliquer le schéma sans migration
npx prisma migrate dev      # Créer une migration
npx prisma studio           # Interface web de la BDD
npx tsx prisma/seed.ts      # Peupler la base (modules + comptes test)
```

---

## 🔑 Variables d'environnement

### Développement (`.env`)

```env
# Base de données
DATABASE_URL="postgresql://vitall_user:vitall_password@localhost:5432/vitall_db?schema=public"

# Authentification
JWT_SECRET="dev-super-secret-jwt-key-change-in-production"

# Stripe (mode test)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Seed (comptes de test)
SEED_ADMIN_PASSWORD="password123"
SEED_USER_PASSWORD="user123"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Production

```env
DATABASE_URL="postgresql://user:password@host:5432/vitall_db?schema=public"
JWT_SECRET="<valeur-aléatoire-32-caractères-minimum>"
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
SEED_ADMIN_PASSWORD="<mot-de-passe-fort-16-caractères>"
SEED_USER_PASSWORD="<mot-de-passe-fort-16-caractères>"
NEXT_PUBLIC_APP_URL="https://votre-domaine.fr"
NODE_ENV="production"
```

> ⚠️ Ne **JAMAIS** commiter le fichier `.env` avec des secrets réels. Utiliser les secrets GitHub Actions et les variables d'environnement Docker Compose en production.

---

## 🧪 Comptes de test

### Créer les comptes

```bash
# Compte ADMIN
npx tsx scripts/create-test-user.ts

# Compte USER
npx tsx scripts/create-test-user-role-user.ts
```

### Identifiants

| Rôle   | Email            | Mot de passe  | Accès                  |
| ------ | ---------------- | ------------- | ---------------------- |
| ADMIN  | `admin@test.fr`  | `password123` | `/admin` + `/dashboard`|
| USER   | `user@test.fr`   | `user123`     | `/dashboard` uniquement|

### Tester la protection des routes

1. **ADMIN** : Connexion → redirection `/admin` → accès à toutes les pages
2. **USER** : Connexion → redirection `/dashboard` → tentative `/admin` → redirigé vers `/dashboard`
3. **Non authentifié** : Accès `/admin` ou `/dashboard` → redirigé vers `/login`

---

## 🎨 Design System & Figma

### Conventions

- **UI Components** : Exclusivement **shadcn/ui**, dans `src/components/ui/`
- **Design tokens** : Utiliser les classes Tailwind mappées (`bg-primary`, `text-neutral-900`, etc.)
- **Polices** : Inter/system-ui (texte), Abadi MT Pro (titres)
- **Couleurs** : Jamais d'hex inline — toujours utiliser les tokens Tailwind ou les variables CSS

### Palette de couleurs

- **Primaire** (orange) : `--color-primary-25` → `--color-primary-900`
- **Secondaire** (bleu) : `--color-secondary-25` → `--color-secondary-900`

### Workflow d'intégration Figma

1. Identifier les composants dans la maquette Figma
2. Mapper vers un composant shadcn/ui existant (`Button`, `Input`, `Card`, etc.)
3. Si aucun équivalent : créer un wrapper Tailwind dans `src/components/ui/`
4. Exporter via `src/components/ui/index.ts`
5. Assembler la page/composant — aucune UI inline dans les pages

### Conventions de nommage

| Type                  | Exemple                       | Règle                          |
| --------------------- | ----------------------------- | ------------------------------ |
| Composant atomique    | `ButtonPrimary`, `InputField` | PascalCase                     |
| Composant composé     | `LoginForm`, `SidebarMenu`    | Nom + rôle                     |
| Composant métier      | `CandidateTable`              | Domaine + type                 |
| Hook React            | `useRecruitmentData`          | camelCase, préfixe `use`       |

---

## 📋 Scripts utiles

| Commande                  | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Serveur de développement (Turbopack)     |
| `npm run build`           | Compilation pour la production           |
| `npm run start`           | Lancer l'application compilée            |
| `npm run test`            | Exécuter les tests unitaires (Vitest)    |
| `npm run test:watch`      | Tests en mode watch                      |
| `npm run lint`            | Vérification ESLint                      |

---

## 🆘 Résolution de problèmes

### `Cannot find module '../lightningcss.darwin-arm64.node'`

Conflit d'architecture Mac M1/M2. Réinstaller proprement :

```bash
rm -rf node_modules package-lock.json
npm install
```

### `npm ci` échoue dans Docker

Le `package-lock.json` est désynchronisé. Lancer `npm install` localement, puis commit le lockfile mis à jour.

### Port 3000 déjà utilisé

```bash
lsof -i :3000
kill -9 <PID>
```

### Base de données inaccessible

```bash
docker compose ps postgres
docker compose logs postgres
docker compose exec postgres pg_isready -U vitall_user
```

### Modifications non prises en compte dans Docker

```bash
docker compose build --no-cache
docker compose up -d --force-recreate
```

---

## ✅ Checklist de mise en production

- [ ] Changer `JWT_SECRET` par une valeur aléatoire sécurisée (32+ caractères)
- [ ] Configurer Stripe en mode **production** (`sk_live_`, `pk_live_`)
- [ ] Activer `secure: true` pour les cookies (HTTPS)
- [ ] Désactiver ou changer les mots de passe des comptes de test
- [ ] Configurer toutes les variables d'environnement de production
- [ ] Tester le flow complet de paiement Stripe
- [ ] Vérifier les redirections HTTPS
- [ ] Activer les logs d'erreur (Sentry, etc.)
- [ ] S'assurer que le scan Snyk passe en CI sans vulnérabilité High/Critical
- [ ] Vérifier le health check : `curl https://votre-domaine.fr/api/health`

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Snyk Documentation](https://docs.snyk.io/)
- [SonarQube](https://docs.sonarqube.org/)

---

*M2 Chef de Projet Digital — Option Fullstack — 2025/2026*
