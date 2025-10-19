#!/bin/bash

set -e  # Exit on any error

echo "🔄 Eseguendo migrazioni database..."
echo "📊 Porta: ${PORT:-8080}"
echo "🌍 Ambiente: ${NODE_ENV:-production}"
echo "🗄️ Database URL: ${DATABASE_URL:0:20}..."

# Prova prima migrate deploy
if npx prisma migrate deploy; then
    echo "✅ Migrazioni completate con successo"
else
    echo "❌ Errore durante l'esecuzione delle migrazioni"
    echo "🔄 Tentativo di push del database..."
    if npx prisma db push; then
        echo "✅ Database sincronizzato con successo"
    else
        echo "❌ Errore critico: impossibile sincronizzare il database"
        echo "🔄 Tentativo di avvio senza migrazioni..."
    fi
fi

echo "🚀 Avviando applicazione..."
exec node dist/server.js
