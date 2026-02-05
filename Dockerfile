# ====================================
# Stage 1: Builder
# ====================================
FROM node:20-slim AS builder

# Installation d'OpenSSL (Nécessaire pour Prisma)
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. On installe les dépendances d'abord (Optimisation du cache Docker)
COPY package.json package-lock.json* ./
RUN npm ci

# 2. On injecte les variables "fantômes" pour passer le build Next.js
# Ces valeurs seront écrasées par Dokploy au moment du lancement (Runtime)
ENV STRIPE_SECRET_KEY=dummy_key
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=dummy_key
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV NEXTAUTH_SECRET=dummy_secret

# 3. On copie le reste du code et on build
COPY . .
RUN npx prisma generate
RUN npm run build

# ====================================
# Stage 2: Runner (Production)
# ====================================
FROM node:20-slim AS runner

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Sécurité : utilisateur non-root avec un home directory valide
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --home /home/nextjs nextjs && \
    mkdir -p /home/nextjs && \
    chown -R nextjs:nodejs /home/nextjs

# On ne copie que le strict nécessaire grâce au mode standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Script de démarrage pour les migrations
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]