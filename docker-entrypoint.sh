#!/bin/sh
set -e

echo "🔄 Running Prisma migrations..."

# Push database schema (creates tables if they don't exist)
# Utiliser prisma@6 pour rester compatible avec le schema actuel (Prisma 7 a des breaking changes)
npx prisma@6 db push --accept-data-loss

echo "✅ Migrations completed successfully"

echo "🚀 Starting Next.js application..."

# Start the Next.js server
exec node server.js
