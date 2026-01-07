# 📝 Guide de création de compte et connexion - Vitall

## 🎯 Vue d'ensemble

Ce guide explique les deux façons de créer un compte sur Vitall et comment se connecter.

---

## 🆕 Création de compte

### Option 1 : Création via paiement (Flux complet)

**URL** : `/account-setup`

#### Étapes du processus :

##### 1️⃣ **Informations de l'organisation**
- Nom de l'organisation
- Email administrateur
- Mot de passe
- Prénom
- Nom de famille

##### 2️⃣ **Sélection des modules**
- **Pack de base** : 270€/mois (obligatoire)
- **Modules additionnels** (15 disponibles) :
  - **RH** (8 modules) : Recrutement (90€), Paie (70€), Planning (65€), Congés (50€), Signature (50€), Formation (40€), Employés (25€), Entretien (20€)
  - **Communication** (3 modules) : Rendez-vous (40€), Email marketing (15€), Chat interne (15€)
  - **Gestion** (4 modules) : Compta (60€), Flottes (50€), Matériel (45€), Note de frais (32,90€)

##### 3️⃣ **Récapitulatif et paiement**
- Affichage du total mensuel
- Redirection vers Stripe Checkout (mode test)
- Paiement sécurisé par carte bancaire

##### 4️⃣ **Confirmation**
- Création automatique de :
  - Organization
  - Utilisateur admin (avec mot de passe hashé bcrypt)
  - Subscription avec les modules sélectionnés
- **Auto-login** : Connexion automatique après paiement
- Redirection vers `/admin` (dashboard administrateur)

#### 🔐 Sécurité
- Mot de passe hashé avec bcrypt (10 rounds)
- Token JWT stocké dans cookie httpOnly
- Session valide 7 jours

---

### Option 2 : Compte de test (Développement)

Pour créer rapidement un compte de test :

```bash
# Compte ADMIN
npx tsx scripts/create-test-user.ts
# Email: admin@test.fr
# Mot de passe: password123

# Compte USER
npx tsx scripts/create-test-user-role-user.ts
# Email: user@test.fr
# Mot de passe: user123
```

---

## 🔑 Connexion

### URL : `/login`

#### Formulaire de connexion
- **Identifiant** : Adresse email
- **Mot de passe** : Mot de passe du compte
- Option "Se souvenir de moi" (conserve la session)

#### Processus d'authentification

1. **Validation des identifiants**
   - API : `POST /api/auth/login`
   - Vérification email/mot de passe avec bcrypt
   - Génération token JWT (7 jours)

2. **Création de session**
   - Cookie `auth-token` (httpOnly, secure en prod)
   - Payload JWT : userId, email, role, organizationId

3. **Redirection intelligente selon le rôle**
   - **ADMIN** → `/admin` (dashboard administration)
   - **USER** → `/dashboard` (dashboard utilisateur)

#### Messages de feedback
- ✅ Succès : "Connexion réussie !"
- ❌ Échec : "Identifiants incorrects"
- ⚠️ Erreur serveur : "Erreur de connexion. Veuillez réessayer."

---

## 🛡️ Système de protection des routes

### Middleware Next.js (`src/middleware.ts`)

#### Routes publiques (accès libre)
- `/login`
- `/account-setup`
- `/account-setup/success`
- `/mentions-legales`
- `/api/stripe/webhook`

#### Routes protégées

##### `/admin/*` (Administrateurs uniquement)
- **Requis** : Token JWT valide + Rôle `ADMIN`
- **Si non authentifié** → Redirection `/login`
- **Si rôle USER** → Redirection `/dashboard`

##### `/dashboard/*` (Utilisateurs authentifiés)
- **Requis** : Token JWT valide (USER ou ADMIN)
- **Si non authentifié** → Redirection `/login`

---

## 👥 Rôles et permissions

### ADMIN
- ✅ Accès complet à `/admin`
- ✅ Accès à `/dashboard`
- ✅ Gestion de l'organisation
- ✅ Gestion des modules
- ✅ Gestion des utilisateurs
- ✅ Paramètres avancés

### USER
- ❌ Pas d'accès à `/admin`
- ✅ Accès à `/dashboard`
- ✅ Consultation profil
- ✅ Notifications
- ✅ Modules autorisés

---

## 🔓 Déconnexion

### Emplacements du bouton de déconnexion

#### Pour les ADMIN :
1. **Dropdown utilisateur** (sidebar)
   - En haut de la sidebar admin
   - Menu déroulant avec avatar
   - Option "Déconnexion"

2. **Page Paramètres** (`/admin/parametres`)
   - Onglet "Sécurité"
   - Bouton rouge en bas de page

#### Pour les USER :
- **Header du dashboard** (`/dashboard`)
  - Bouton "Déconnexion" en haut à droite
  - Icône LogOut visible

### Processus de déconnexion
1. Appel API : `POST /api/auth/logout`
2. Suppression du cookie `auth-token`
3. Redirection vers `/login`

---

## 🧪 Comptes de test disponibles

### Administrateur
```
Email    : admin@test.fr
Password : password123
Rôle     : ADMIN
Accès    : /admin + /dashboard
```

### Utilisateur standard
```
Email    : user@test.fr
Password : user123
Rôle     : USER
Accès    : /dashboard uniquement
```

---

## 🔧 Configuration requise

### Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://user@localhost:5432/vitall_db"

# JWT
JWT_SECRET="votre-secret-super-securise-changez-moi-en-production"

# Stripe (mode test)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Installation des modules

Les modules doivent être créés en base de données :

```bash
npx tsx prisma/seed.ts
```

Cela crée les 15 modules avec leurs prix respectifs.

---

## 📊 Flux de données

### Création de compte via paiement

```
/account-setup (3 étapes)
    ↓
POST /api/stripe/checkout (création session Stripe)
    ↓
Paiement Stripe Checkout
    ↓
Webhook /api/stripe/webhook (confirmation paiement)
    ↓
Prisma Transaction:
  - Create Organization
  - Create User (bcrypt hash password)
  - Create Subscription
  - Create SubscriptionModule (pour chaque module)
    ↓
/account-setup/success (session_id)
    ↓
GET /api/stripe/session-user (récupère infos user)
    ↓
POST /api/auth/auto-login (crée session JWT)
    ↓
Redirection /admin (connecté)
```

### Connexion classique

```
/login (formulaire)
    ↓
POST /api/auth/login
  - Vérifier email
  - bcrypt.compare(password, user.password)
  - SignJWT (userId, email, role, organizationId)
  - Set cookie auth-token
    ↓
Response avec role
    ↓
Redirection selon rôle:
  - ADMIN → /admin
  - USER → /dashboard
```

---

## 🚨 Gestion des erreurs

### Erreurs courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Identifiants incorrects" | Email ou mot de passe invalide | Vérifier les identifiants |
| "Non authentifié" | Token absent ou expiré | Se reconnecter |
| Redirection `/login` sur `/admin` | Rôle USER | Normal, utiliser compte ADMIN |
| "Erreur serveur" | Problème base de données | Vérifier DATABASE_URL |

### Logs utiles

```bash
# Logs API auth
console.log("User found:", user.email, user.role)

# Logs middleware
console.log("Token verified, role:", payload.role)

# Logs webhook Stripe
console.log("Payment success for:", email)
```

---

## ✅ Checklist de mise en production

- [ ] Changer `JWT_SECRET` par une valeur aléatoire sécurisée
- [ ] Configurer Stripe en mode production
- [ ] Activer `secure: true` pour les cookies (HTTPS)
- [ ] Désactiver les comptes de test
- [ ] Configurer les variables d'environnement de production
- [ ] Tester le flow complet de paiement
- [ ] Vérifier les redirections HTTPS
- [ ] Activer les logs d'erreur (Sentry, etc.)

---

## 📞 Support

Pour toute question sur l'authentification ou la création de compte :
- Documentation Stripe : https://stripe.com/docs
- Documentation Next.js : https://nextjs.org/docs
- Documentation Prisma : https://www.prisma.io/docs
