# ===========================================
# DOCKERFILE PER CLOUD RUN - VIETNAMONAMOUR
# ===========================================

# Usa Node.js 18 LTS come base
FROM node:18-alpine AS base

# Installa dipendenze di sistema necessarie
RUN apk add --no-cache \
    openssl \
    postgresql-client \
    dumb-init

# Crea directory di lavoro
WORKDIR /app

# ===========================================
# STAGE 1: BUILD
# ===========================================
FROM base AS builder

# Copia package files
COPY package*.json ./
COPY prisma ./prisma/

# Installa tutte le dipendenze (dev + prod)
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Copia sorgenti
COPY . .

# Genera Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ===========================================
# STAGE 2: PRODUCTION
# ===========================================
FROM base AS production

# Crea utente non-root per sicurezza
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copia solo i file necessari per la produzione
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copia file statici
COPY --chown=nextjs:nodejs src/public ./dist/public
COPY --chown=nextjs:nodejs src/views ./dist/views

# Imposta utente non-root
USER nextjs

# Esponi porta (Cloud Run usa PORT env var)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Usa dumb-init per gestire i segnali correttamente
ENTRYPOINT ["dumb-init", "--"]

# Avvia l'applicazione
CMD ["node", "dist/server.js"]
