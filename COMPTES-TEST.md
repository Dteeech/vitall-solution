# 🧪 Comptes de test - Vitall

## Authentification

### 👤 Compte Administrateur
- **Email** : `admin@test.fr`
- **Mot de passe** : `password123`
- **Rôle** : `ADMIN`
- **Accès** : ✅ Toutes les pages `/admin`

### 👤 Compte Utilisateur Standard
- **Email** : `user@test.fr`
- **Mot de passe** : `user123`
- **Rôle** : `USER`
- **Accès** : ✅ Dashboard utilisateur `/dashboard` | ❌ Interdit sur `/admin` (redirection automatique)

## Protection des routes

Le middleware protège automatiquement :
- ✅ Routes `/admin/*` → Nécessite authentification + rôle ADMIN
- ✅ Routes `/dashboard/*` → Nécessite authentification (USER ou ADMIN)
- ✅ Routes publiques : `/login`, `/account-setup`, `/mentions-legales`
- ✅ Redirection intelligente après login selon le rôle

## Tester la protection

1. **Test avec compte ADMIN** :
   ```bash
   # Se connecter avec admin@test.fr / password123
   # → Redirection automatique vers /admin
   # ✅ Accès à toutes les pages /admin
   # ✅ Accès aussi à /dashboard
   ```

2. **Test avec compte USER** :
   ```bash
   # Se connecter avec user@test.fr / user123
   # → Redirection automatique vers /dashboard
   # ✅ Accès à /dashboard
   # ❌ Si tentative d'accès à /admin → Redirection vers /dashboard
   ```

3. **Test sans authentification** :
   ```bash
   # Accéder directement à /admin ou /dashboard sans être connecté
   # → Redirection automatique vers /login
   ```
