#!/bin/bash

echo "🔄 Eseguendo migrazioni database..."
npx prisma migrate deploy

echo "🚀 Avviando applicazione..."
node dist/server.js
