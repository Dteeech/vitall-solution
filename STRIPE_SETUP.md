# Configuration Stripe pour tests

## 1️⃣ Créer un compte Stripe Test

1. Allez sur https://dashboard.stripe.com/register
2. Créez un compte (ou connectez-vous)
3. **Activez le mode Test** (toggle en haut à droite)

## 2️⃣ Récupérer les clés API

1. Allez dans **Developers** → **API keys**
2. Copiez :
   - `Publishable key` (commence par `pk_test_...`)
   - `Secret key` (commence par `sk_test_...`)
3. Mettez à jour votre fichier `.env` :

```env
STRIPE_SECRET_KEY=sk_test_votre_cle_ici
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_ici
```

## 3️⃣ Installer Stripe CLI (pour tester les webhooks)

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Autres OS : https://stripe.com/docs/stripe-cli
```

## 4️⃣ Connecter Stripe CLI

```bash
stripe login
```

## 5️⃣ Lancer le webhook en local

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Vous obtiendrez un `webhook secret` (commence par `whsec_...`). Ajoutez-le dans `.env` :

```env
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_ici
```

## 6️⃣ Tester le paiement

1. Lancez votre serveur : `npm run dev`
2. Allez sur : http://localhost:3000/account-setup
3. Remplissez le formulaire
4. Utilisez la carte de test Stripe :
   - **Numéro** : `4242 4242 4242 4242`
   - **Date** : n'importe quelle date future (ex: 12/34)
   - **CVC** : n'importe quel 3 chiffres (ex: 123)
   - **Code postal** : n'importe lequel

## 7️⃣ Vérifier le webhook

Dans le terminal avec `stripe listen`, vous verrez :
```
✔ Received event checkout.session.completed
```

Votre compte sera créé automatiquement dans la base de données !

## 📋 Cartes de test Stripe

| Carte | Numéro | Résultat |
|-------|--------|----------|
| Visa succès | 4242 4242 4242 4242 | ✅ Paiement accepté |
| Visa refusé | 4000 0000 0000 0002 | ❌ Paiement refusé |
| 3D Secure | 4000 0027 6000 3184 | 🔐 Authentification requise |

Plus de cartes : https://stripe.com/docs/testing
