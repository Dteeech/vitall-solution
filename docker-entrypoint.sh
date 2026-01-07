#!/bin/sh
set -e

echo "🔄 Running Prisma migrations..."

# Push database schema (creates tables if they don't exist)
npx prisma db push --accept-data-loss

echo "✅ Migrations completed successfully"

echo "🚀 Starting Next.js application..."

# Start the Next.js server
exec node server.js
