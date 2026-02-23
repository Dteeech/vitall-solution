#!/bin/sh
set -e

if [ "$NODE_ENV" = "development" ]; then
  echo "🛠️ Mode DÉVELOPPEMENT activé"
  
  echo "📦 1/3 - Installation des dépendances manquantes..."
  npm install --force
  
  echo "🔄 2/3 - Mise à jour de la base de données (Prisma)..."
  npx prisma@6 db push --accept-data-loss
  
  echo "🚀 3/3 - Démarrage du Hot Reload..."
  exec npm run dev

else
  echo "🌍 Mode PRODUCTION activé"
  
  echo "🔄 1/2 - Mise à jour de la base de données (Prisma)..."
  npx prisma@6 db push --accept-data-loss
  
  echo "🚀 2/2 - Démarrage du serveur optimisé..."
  exec node server.js
fi