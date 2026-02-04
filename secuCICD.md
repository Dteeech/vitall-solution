# 🔐 Analyse CI/CD et Sécurité - Vitall Solution

> Rapport d'audit généré le 4 février 2026

---

## 📊 Résumé Exécutif

| Catégorie | Score | Statut |
|-----------|-------|--------|
| Docker & Containerisation | ⭐⭐⭐⭐ | ✅ Bon |
| CI/CD Pipeline | ⭐⭐ | ⚠️ À améliorer |
| Sécurité des Secrets | ⭐ | 🔴 **CRITIQUE** |
| Authentification | ⭐⭐⭐ | ⚠️ Correct |
| Headers de Sécurité | ⭐ | 🔴 Absent |
| Base de Données | ⭐⭐⭐ | ✅ Correct |

---

## 1️⃣ Dockerfile

### ✅ Points positifs

- **Multi-stage build** : Séparation builder/runner optimisant la taille de l'image
- **Utilisateur non-root** : Création d'un utilisateur `nextjs` (UID 1001) pour la sécurité
- **Mode standalone** : Utilisation de `output: 'standalone'` dans Next.js réduisant la taille
- **Nettoyage apt cache** : `rm -rf /var/lib/apt/lists/*` après installation
- **Variables factices pour le build** : Contourne le problème des variables d'environnement au build
- **Home directory valide** : `/home/nextjs` créé pour permettre à npm de fonctionner

### ⚠️ Points à améliorer

- **Pas de version fixe pour npm** : `npm ci` sans version verrouillée
- **OpenSSL potentiellement vulnérable** : Pas de version spécifique d'OpenSSL
- **Pas de health check** dans le Dockerfile lui-même

### 🔴 Problèmes de sécurité

- ~~**Image de base non-alpine**~~ : `node:20-slim` est un bon compromis entre taille et compatibilité ✅

### 💡 Recommandations

```dockerfile
# Ajouter un healthcheck directement dans le Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health')"
```

---

## 2️⃣ docker-compose.yml

### ✅ Points positifs

- **Healthchecks** configurés pour les deux services
- **depends_on avec condition** : Attente de PostgreSQL healthy avant démarrage de l'app
- **Volumes nommés** : `postgres_data` pour la persistance
- **restart: unless-stopped** : Redémarrage automatique

### ⚠️ Points à améliorer

- **Pas de réseau dédié** : Utilisation du réseau par défaut
- **Pas de limits CPU/mémoire** : Aucune limite de ressources
- **Attribut `version` obsolète** : À supprimer

### 🔴 Problèmes de sécurité

```yaml
# ❌ SECRETS EN CLAIR dans docker-compose.yml !
POSTGRES_PASSWORD: vitall_password
JWT_SECRET: "dev-super-secret-jwt-key-change-in-production"
DATABASE_URL: "postgresql://vitall_user:vitall_password@postgres:5432/vitall_db"
```

### 💡 Recommandations

```yaml
# Supprimer la ligne version (obsolète)
# version: '3.8'  ← SUPPRIMER

services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
    networks:
      - vitall-network
    environment:
      DATABASE_URL: ${DATABASE_URL}  # Utiliser .env exclusivement
      JWT_SECRET: ${JWT_SECRET}

networks:
  vitall-network:
    driver: bridge
```

---

## 3️⃣ docker-entrypoint.sh

### ✅ Points positifs

- **set -e** : Arrêt en cas d'erreur
- **Messages de log** : Bonne traçabilité
- **prisma@6** : Version fixée pour éviter les breaking changes de Prisma 7

### 🔴 Problèmes de sécurité

```bash
# ⚠️ --accept-data-loss peut supprimer des données en production !
npx prisma@6 db push --accept-data-loss
```

### 💡 Recommandations

```bash
#!/bin/sh
set -e

echo "🔄 Running Prisma migrations..."

# ✅ Utiliser migrate deploy en production (plus sûr)
npx prisma@6 migrate deploy

echo "✅ Migrations completed successfully"
echo "🚀 Starting Next.js application..."

exec node server.js
```

---

## 4️⃣ Fichier .env - 🚨 CRITIQUE

### 🔴 SECRETS EXPOSÉS DANS LE DÉPÔT

Le fichier `.env` contient des **secrets réels** qui semblent avoir été commités :

```env
# ❌ CLÉS STRIPE RÉELLES EXPOSÉES !
STRIPE_SECRET_KEY=sk_test_51SmtAxDyEFvILpewXxyYBaQDbu...
STRIPE_WEBHOOK_SECRET=whsec_e128637abb1b4cc46dca54...

# ❌ MOT DE PASSE BD EN CLAIR
DATABASE_URL=postgresql://vitall_user:vitall_password@...
```

### 💡 Actions URGENTES

1. **Révoquer immédiatement** les clés Stripe sur le dashboard Stripe
2. **Vérifier si le .env est dans l'historique Git** et le supprimer
3. **Créer un `.env.example`** sans secrets réels
4. **Utiliser des variables d'environnement** injectées par l'orchestrateur (Dokploy, etc.)

```bash
# Commande pour supprimer de l'historique Git si nécessaire
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

### Fichier `.env.example` recommandé

```env
# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/database?schema=public

# Authentification
JWT_SECRET=change-me-in-production-use-at-least-32-chars

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 5️⃣ CI/CD Pipeline (.github/workflows)

### ✅ Points positifs

- Build et push vers GitHub Container Registry (GHCR)
- Utilisation de GITHUB_TOKEN pour l'authentification

### ⚠️ Points à améliorer MAJEURS

| Manque | Impact |
|--------|--------|
| Pas de tests | Bugs en production |
| Pas de scan de vulnérabilités | Failles de sécurité |
| Pas de linting | Code inconsistant |
| Pas de cache Docker | Builds lents |
| Uniquement tag `latest` | Pas de versioning |
| Pas de déploiement automatique | Intervention manuelle |

### 💡 Pipeline CI/CD recommandé

```yaml
name: CI/CD Vitall

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # 1. Tests et linting
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test --if-present

  # 2. Scan de sécurité
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

  # 3. Build et push Docker
  build-and-push:
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha
            type=raw,value=latest

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # 4. Déploiement (optionnel - webhook Dokploy)
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Trigger Dokploy deployment
        run: |
          curl -X POST "${{ secrets.DOKPLOY_WEBHOOK_URL }}" \
            -H "Content-Type: application/json"
```

---

## 6️⃣ Middleware d'Authentification

### ✅ Points positifs

- Vérification JWT avec `jose`
- Redirection selon les rôles (ADMIN/USER)
- Routes publiques bien définies

### 🔴 Problèmes de sécurité CRITIQUES

```typescript
// ❌ JAMAIS de valeur par défaut pour un secret !
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'votre-secret-super-securise-changez-moi'
)
```

### 💡 Correction recommandée

```typescript
// ✅ Crash explicite si pas de secret
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
```

### ⚠️ Améliorations suggérées

- Ajouter du **rate limiting** (limiter le nombre de requêtes)
- Ajouter une protection **CSRF** pour les formulaires
- Implémenter un **refresh token** au lieu d'un token de 7 jours

---

## 7️⃣ Endpoint Auto-Login - 🚨 VULNÉRABILITÉ CRITIQUE

### 🔴 Problème majeur dans `/api/auth/auto-login`

```typescript
export async function POST(request: Request) {
  // ❌ AUCUNE VÉRIFICATION - N'importe qui peut créer un token !
  const { userId, email, role, organizationId } = await request.json()
  
  const token = await new SignJWT({ userId, email, role, organizationId })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}
```

**⚠️ N'importe qui peut appeler cette API et s'authentifier comme n'importe quel utilisateur !**

### 💡 Solutions

1. **Supprimer cet endpoint** s'il n'est pas nécessaire
2. **Ajouter une vérification** avec un secret interne :

```typescript
export async function POST(request: Request) {
  const { userId, email, role, organizationId, internalSecret } = await request.json()
  
  // ✅ Vérification du secret interne
  if (internalSecret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // ... reste du code
}
```

---

## 8️⃣ Headers de Sécurité HTTP - ABSENTS

Aucun header de sécurité n'est configuré dans `next.config.ts`.

### 💡 Configuration recommandée

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { 
            key: 'Strict-Transport-Security', 
            value: 'max-age=31536000; includeSubDomains' 
          },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com;"
          },
        ],
      },
    ]
  },
}
```

---

## 📊 Matrice des Risques

| Risque | Sévérité | Probabilité | Impact | Action |
|--------|----------|-------------|--------|--------|
| Secrets Stripe exposés | 🔴 Critique | Haute | Fraude financière | Révoquer immédiatement |
| Endpoint auto-login vulnérable | 🔴 Critique | Haute | Usurpation d'identité | Supprimer/sécuriser |
| Secret JWT par défaut | 🔴 Critique | Haute | Compromission auth | Corriger le code |
| Pas de headers sécurité | 🟠 Élevé | Moyenne | XSS, Clickjacking | Configurer next.config |
| Pas de rate limiting | 🟠 Élevé | Moyenne | Brute force, DDoS | Implémenter |
| CI sans tests/scans | 🟡 Moyen | Haute | Bugs/failles en prod | Améliorer pipeline |
| db push --accept-data-loss | 🟡 Moyen | Moyenne | Perte de données | Utiliser migrate |

---

## 🎯 Plan d'Action Prioritaire

### 🔴 Immédiat (24h)

- [ ] **Révoquer les clés Stripe** sur dashboard.stripe.com
- [ ] **Supprimer/sécuriser l'endpoint auto-login**
- [ ] **Nettoyer l'historique Git** du fichier .env (si commité)
- [ ] **Supprimer le secret JWT par défaut** dans le code

### 🟠 Court terme (1 semaine)

- [ ] Ajouter les **headers de sécurité HTTP**
- [ ] Implémenter le **rate limiting**
- [ ] Améliorer la **CI avec tests et scans**
- [ ] Remplacer `db push` par `migrate deploy`
- [ ] Supprimer l'attribut `version` du docker-compose.yml

### 🟡 Moyen terme (1 mois)

- [ ] Implémenter un **gestionnaire de secrets** (Vault, etc.)
- [ ] Ajouter des **refresh tokens**
- [ ] Implémenter le **logging/monitoring**
- [ ] Ajouter des **tests de sécurité automatisés**

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)
- [Prisma Migrate vs Push](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

*Document généré pour le projet Vitall Solution - À mettre à jour régulièrement*
