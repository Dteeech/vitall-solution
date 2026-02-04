# Configuration des Secrets pour la Production

## Secrets à configurer en production

Pour que l'application fonctionne correctement en production, vous devez configurer les variables d'environnement suivantes :

### 1. Base de données
```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
```

### 2. Authentification
```
JWT_SECRET=votre-secret-jwt-de-production-minimum-32-caracteres
```

### 3. Stripe (Paiements)
```
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete_stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook
```

### 4. Seed (Comptes de test)
```
SEED_ADMIN_PASSWORD=votre-mot-de-passe-admin-securise
SEED_USER_PASSWORD=votre-mot-de-passe-user-securise
```

### 5. Application
```
NEXT_PUBLIC_APP_URL=https://votre-domaine.fr
NODE_ENV=production
```

## ⚠️ Sécurité Important

1. **Après le premier déploiement** : Changez immédiatement les mots de passe des comptes admin et user via l'interface de l'application
2. **Ne JAMAIS** commiter les fichiers `.env` avec des secrets réels
3. **Utilisez des mots de passe forts** pour les comptes de production (minimum 16 caractères, avec lettres, chiffres et symboles)
4. **Révoquez immédiatement** les clés Stripe si elles sont exposées

## Comptes créés par le seed

- **Admin** : `admin@test.fr` (mot de passe défini par `SEED_ADMIN_PASSWORD`)
- **User** : `user@test.fr` (mot de passe défini par `SEED_USER_PASSWORD`)

## Comment configurer

### Option 1 : Fichier .env sur le serveur

Créez un fichier `.env` sur votre serveur de production :

```bash
# Sur votre serveur
cd /chemin/vers/votre/app
nano .env
```

Collez toutes les variables ci-dessus avec leurs vraies valeurs.

### Option 2 : Variables d'environnement dans docker-compose.yml

Modifiez votre `docker-compose.yml` en production :

```yaml
services:
  app:
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      SEED_ADMIN_PASSWORD: ${SEED_ADMIN_PASSWORD}
      SEED_USER_PASSWORD: ${SEED_USER_PASSWORD}
      # ... autres variables
```

Puis créez un fichier `.env` à côté du `docker-compose.yml`.

### Option 3 : Variables d'environnement système

```bash
export DATABASE_URL="postgresql://..."
export JWT_SECRET="votre-secret..."
export SEED_ADMIN_PASSWORD="..."
export SEED_USER_PASSWORD="..."
```

## Vérification

Pour vérifier que les variables sont bien configurées :

```bash
# Si vous utilisez Docker
docker exec vitall-app env | grep -E "DATABASE_URL|JWT_SECRET|STRIPE|SEED"

# Sinon
printenv | grep -E "DATABASE_URL|JWT_SECRET|STRIPE|SEED"
```
