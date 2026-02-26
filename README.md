# Architecture du Projet Vitall

> **Plateforme modulaire pour les services institutionnels**

---

## 🚀 Documentation technique (Lancer le projet)

### Installation Locale (sans Docker)

1. **Cloner le dépôt** : `git clone <url-du-repo> && cd vitall-solution`
2. **Variables d'environnement** : `cp .env.example .env`
3. **Dépendances** : `npm install`
4. **Base de données** :
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
5. **Démarrer** : `npm run dev`

### Installation via Docker

```bash
docker compose up -d
```

---

## 🏗️ Architecture & Choix techniques

### Choix des outils (DevSecOps)

- **GitHub Actions** : Intégration native pour CI/CD.
- **Snyk** : Scan de sécurité des conteneurs pour bloquer les vulnérabilités High/Critical.
- **Gitleaks** : Détection de secrets dans l'historique.
- **Alpine Linux** : Image légère (0 vulnérabilité vs Debian).

---

## 🚢 Déploiement & Maintenance (incl. Rollback)

### 🔄 Procédure de Rollback

Si la production échoue :
1. **Via GitHub Actions** : Ré-exécuter le dernier job réussi.
2. **Manuellement** :
   ```bash
   docker compose pull
   docker compose up -d --force-recreate
   ```
3. **Retour BDD** : `docker compose exec -T postgres psql -U vitall_user vitall_db < backup_prev.sql`

---
*M2 Chef de Projet Digital — Option Fullstack — 2025/2026*
