# 🐳 Docker Cheatsheet - Vitall Application

## 📋 Table des matières
- [Prérequis](#prérequis)
- [Démarrage rapide](#démarrage-rapide)
- [Commandes Docker Compose essentielles](#commandes-docker-compose-essentielles)
- [Commandes Docker de base](#commandes-docker-de-base)
- [Debugging et logs](#debugging-et-logs)
- [Gestion des données](#gestion-des-données)
- [Workflow de développement](#workflow-de-développement)
- [Déploiement Dokploy](#déploiement-dokploy)

---

## 🚀 Prérequis

```bash
# Vérifier que Docker est installé
docker --version
docker compose version

# Si pas installé, télécharger Docker Desktop :
# https://www.docker.com/products/docker-desktop
```

---

## ⚡ Démarrage rapide

```bash
# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Remplir les variables Stripe dans .env
# STRIPE_SECRET_KEY=sk_test_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# 3. Lancer l'application (PostgreSQL + Next.js)
docker compose up -d

# 4. Voir les logs en temps réel
docker compose logs -f

# 5. Accéder à l'application
# http://localhost:3000

# 6. Arrêter l'application
docker compose down
```

---

## 🎯 Commandes Docker Compose essentielles

### Démarrage et arrêt

```bash
# Démarrer tous les services en arrière-plan (-d = detached)
docker compose up -d

# Démarrer avec rebuild (après modification du code)
docker compose up -d --build

# Démarrer uniquement un service spécifique
docker compose up -d postgres
docker compose up -d app

# Arrêter tous les services (garde les données)
docker compose down

# Arrêter et SUPPRIMER les volumes (⚠️ perte de données)
docker compose down -v

# Redémarrer tous les services
docker compose restart

# Redémarrer un service spécifique
docker compose restart app
```

### État et informations

```bash
# Voir les services en cours d'exécution
docker compose ps

# Voir tous les services (même arrêtés)
docker compose ps -a

# Voir les logs de tous les services
docker compose logs

# Suivre les logs en temps réel (-f = follow)
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f app
docker compose logs -f postgres

# Voir les 100 dernières lignes
docker compose logs --tail=100
```

---

## 🔧 Commandes Docker de base

### Images

```bash
# Lister toutes les images
docker images

# Construire une image manuellement
docker build -t vitall-app .

# Supprimer une image
docker rmi vitall-app

# Supprimer toutes les images non utilisées
docker image prune -a

# Voir la taille des images
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### Conteneurs

```bash
# Lister les conteneurs actifs
docker ps

# Lister tous les conteneurs (actifs + arrêtés)
docker ps -a

# Démarrer un conteneur arrêté
docker start vitall-app

# Arrêter un conteneur
docker stop vitall-app

# Redémarrer un conteneur
docker restart vitall-app

# Supprimer un conteneur
docker rm vitall-app

# Forcer la suppression d'un conteneur actif
docker rm -f vitall-app

# Supprimer tous les conteneurs arrêtés
docker container prune
```

### Exécution de commandes

```bash
# Entrer dans un conteneur en mode interactif
docker exec -it vitall-app sh

# Exécuter une commande dans un conteneur
docker exec vitall-app ls -la

# Exécuter une commande Prisma
docker exec vitall-app npx prisma studio
docker exec vitall-app npx prisma db seed

# Avec docker compose
docker compose exec app sh
docker compose exec postgres psql -U vitall_user -d vitall_db
```

---

## 🐛 Debugging et logs

### Logs avancés

```bash
# Logs en temps réel avec timestamps
docker compose logs -f --timestamps

# Logs depuis les 5 dernières minutes
docker compose logs --since 5m

# Logs d'une période spécifique
docker compose logs --since "2026-01-07T13:00:00" --until "2026-01-07T14:00:00"

# Logs avec grep (filtrer)
docker compose logs app | grep "error"
docker compose logs app | grep -i "stripe"
```

### Inspection

```bash
# Inspecter un conteneur (config complète JSON)
docker inspect vitall-app

# Voir l'utilisation des ressources en temps réel
docker stats

# Voir seulement certains conteneurs
docker stats vitall-app vitall-postgres

# Vérifier le health check
docker inspect vitall-app | grep -A 10 "Health"
```

### Connexion base de données

```bash
# Se connecter à PostgreSQL
docker compose exec postgres psql -U vitall_user -d vitall_db

# Ou directement
docker exec -it vitall-postgres psql -U vitall_user -d vitall_db

# Commandes SQL utiles
# \dt          # Lister les tables
# \d users     # Décrire la table users
# SELECT * FROM "User" LIMIT 10;
# \q           # Quitter
```

---

## 💾 Gestion des données

### Volumes

```bash
# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect projetv2_postgres_data

# Supprimer un volume spécifique (⚠️ perte de données)
docker volume rm projetv2_postgres_data

# Supprimer tous les volumes non utilisés
docker volume prune

# Backup de la base de données
docker compose exec postgres pg_dump -U vitall_user vitall_db > backup.sql

# Restaurer depuis un backup
docker compose exec -T postgres psql -U vitall_user vitall_db < backup.sql
```

---

## 🔄 Workflow de développement

### Développement local (sans Docker)

```bash
npm run dev
```

### Développement avec Docker

```bash
# 1. Modifier le code

# 2. Rebuild et redémarrer
docker compose up -d --build

# 3. Voir les logs
docker compose logs -f app

# 4. Si problème, reset complet
docker compose down -v
docker compose up -d --build
```

### Tests et migrations

```bash
# Exécuter les migrations Prisma
docker compose exec app npx prisma migrate dev

# Générer le client Prisma
docker compose exec app npx prisma generate

# Seed la base de données
docker compose exec app npx prisma db seed

# Ouvrir Prisma Studio
docker compose exec app npx prisma studio
# Puis accéder à http://localhost:5555
```

---

## 🚢 Déploiement Dokploy

### 1. Build l'image pour production

```bash
# Build l'image
docker build -t vitall-app:latest .

# Tester localement
docker run -d \
  --name vitall-test \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="secret" \
  -e STRIPE_SECRET_KEY="sk_live_..." \
  vitall-app:latest

# Vérifier
curl http://localhost:3000/api/health

# Arrêter le test
docker stop vitall-test && docker rm vitall-test
```

### 2. Variables d'environnement Dokploy

Configurer dans Dokploy :

```env
DATABASE_URL=postgresql://user:password@postgres-host:5432/vitall_db
JWT_SECRET=production-super-secret-key
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NODE_ENV=production
```

### 3. Commandes Dokploy CLI

```bash
# Se connecter à Dokploy
dokploy login

# Déployer
dokploy deploy

# Voir les logs
dokploy logs

# Redémarrer
dokploy restart
```

---

## 🧹 Nettoyage complet

```bash
# Tout arrêter
docker compose down

# Supprimer les conteneurs, réseaux, volumes
docker compose down -v

# Nettoyer tout Docker (⚠️ attention)
docker system prune -a --volumes

# Libérer de l'espace disque
docker system df  # Voir l'utilisation
docker builder prune  # Nettoyer le cache de build
```

---

## 🆘 Résolution de problèmes courants

### Port déjà utilisé

```bash
# Trouver qui utilise le port 3000
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

### Conteneur ne démarre pas

```bash
# Voir les logs d'erreur
docker compose logs app

# Vérifier le status
docker compose ps

# Recréer complètement
docker compose down -v
docker compose up -d --build
```

### Base de données inaccessible

```bash
# Vérifier que PostgreSQL est actif
docker compose ps postgres

# Voir les logs PostgreSQL
docker compose logs postgres

# Tester la connexion
docker compose exec postgres pg_isready -U vitall_user
```

### Modifications du code non prises en compte

```bash
# Forcer le rebuild
docker compose build --no-cache
docker compose up -d --force-recreate
```

---

## 📚 Ressources utiles

- [Documentation Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Docker](https://nextjs.org/docs/deployment#docker-image)
- [Prisma Docker](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

## 🎓 Mémo ultra-rapide

```bash
# Démarrer
docker compose up -d

# Voir les logs
docker compose logs -f

# Rebuild après modif code
docker compose up -d --build

# Entrer dans le conteneur
docker compose exec app sh

# Base de données
docker compose exec postgres psql -U vitall_user -d vitall_db

# Arrêter
docker compose down

# Tout nettoyer
docker compose down -v && docker system prune -a
```

---

✅ **Tu es maintenant prêt à utiliser Docker comme un pro !** 🚀
