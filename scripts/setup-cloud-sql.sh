#!/bin/bash

# ===========================================
# SCRIPT SETUP CLOUD SQL - VIETNAMONAMOUR
# ===========================================

set -e

# Configurazioni
PROJECT_ID="your-project-id"
REGION="europe-west1"
INSTANCE_NAME="vtn-postgres"
DATABASE_NAME="vietnamonamour"
DB_USER="vtn_user"
DB_PASSWORD="your-secure-password"

echo "🚀 Configurazione Cloud SQL per Vietnamonamour..."

# 1. Crea l'istanza Cloud SQL
echo "📦 Creando istanza Cloud SQL..."
gcloud sql instances create $INSTANCE_NAME \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --storage-type=SSD \
    --storage-size=10GB \
    --storage-auto-increase \
    --backup-start-time=03:00 \
    --enable-bin-log \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=04 \
    --maintenance-release-channel=production \
    --deletion-protection \
    --project=$PROJECT_ID

# 2. Crea il database
echo "🗄️ Creando database..."
gcloud sql databases create $DATABASE_NAME \
    --instance=$INSTANCE_NAME \
    --project=$PROJECT_ID

# 3. Crea l'utente del database
echo "👤 Creando utente database..."
gcloud sql users create $DB_USER \
    --instance=$INSTANCE_NAME \
    --password=$DB_PASSWORD \
    --project=$PROJECT_ID

# 4. Abilita l'API Cloud SQL Admin
echo "🔧 Abilitando API Cloud SQL Admin..."
gcloud services enable sqladmin.googleapis.com --project=$PROJECT_ID

# 5. Configura le autorizzazioni di rete (opzionale - per accesso esterno)
echo "🌐 Configurando autorizzazioni di rete..."
gcloud sql instances patch $INSTANCE_NAME \
    --authorized-networks=0.0.0.0/0 \
    --project=$PROJECT_ID

# 6. Ottieni l'IP privato dell'istanza
echo "📍 Ottenendo informazioni di connessione..."
INSTANCE_IP=$(gcloud sql instances describe $INSTANCE_NAME --project=$PROJECT_ID --format="value(ipAddresses[0].ipAddress)")

echo "✅ Setup Cloud SQL completato!"
echo "📊 Informazioni di connessione:"
echo "   - Istanza: $INSTANCE_NAME"
echo "   - Database: $DATABASE_NAME"
echo "   - Utente: $DB_USER"
echo "   - IP: $INSTANCE_IP"
echo "   - Regione: $REGION"
echo ""
echo "🔗 URL di connessione per Secret Manager:"
echo "postgresql://$DB_USER:$DB_PASSWORD@/vietnamonamour?host=/cloudsql/$PROJECT_ID:$REGION:$INSTANCE_NAME"
echo ""
echo "⚠️  Ricorda di:"
echo "   1. Aggiornare il DATABASE_URL in Secret Manager"
echo "   2. Eseguire le migrazioni Prisma dopo il deploy"
echo "   3. Configurare i backup automatici"
