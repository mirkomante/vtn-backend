# ===========================================
# GUIDA COMPLETA DEPLOY GCP - VIETNAMONAMOUR
# ===========================================

## 📋 Panoramica

Questa guida ti accompagnerà attraverso il deploy completo del backend Vietnamonamour su Google Cloud Platform utilizzando:
- **Cloud Run** per l'applicazione
- **Cloud SQL** per PostgreSQL
- **Cloud Build** per CI/CD
- **Secret Manager** per le variabili sensibili
- **Container Registry** per le immagini Docker

## 🎯 Prerequisiti

1. Account Google Cloud Platform attivo
2. Progetto GCP creato
3. Billing abilitato
4. Google Cloud CLI installato e configurato
5. Repository GitHub del progetto

## 🚀 FASE 1: Preparazione Progetto GCP

### 1.1 Abilitare le API Necessarie

```bash
# Imposta il progetto
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Abilita le API richieste
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    containerregistry.googleapis.com \
    cloudresourcemanager.googleapis.com
```

### 1.2 Configurare IAM

```bash
# Ottieni il numero del progetto
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

# Abilita Cloud Build per Cloud Run
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/run.admin"

# Abilita Cloud Build per Container Registry
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/storage.admin"

# Abilita Cloud Build per Secret Manager
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

## 🗄️ FASE 2: Configurazione Cloud SQL

### 2.1 Creare l'istanza PostgreSQL

```bash
# Esegui lo script di setup (modifica i valori prima)
./scripts/setup-cloud-sql.sh
```

**OPPURE** configura manualmente:

1. Vai su **Cloud SQL** nella console GCP
2. Clicca **"Crea istanza"**
3. Seleziona **PostgreSQL**
4. Configurazione:
   - **ID istanza**: `vtn-postgres`
   - **Password root**: Scegli una password sicura
   - **Regione**: `europe-west1`
   - **Tipo di macchina**: `db-f1-micro` (per iniziare)
   - **Archiviazione**: SSD, 10GB
   - **Backup automatico**: Abilitato
   - **Protezione eliminazione**: Abilitata

### 2.2 Creare Database e Utente

```sql
-- Crea il database
CREATE DATABASE vietnamonamour;

-- Crea l'utente
CREATE USER vtn_user WITH PASSWORD 'your-secure-password';

-- Concedi privilegi
GRANT ALL PRIVILEGES ON DATABASE vietnamonamour TO vtn_user;
```

## 🔐 FASE 3: Configurazione Secret Manager

### 3.1 Creare i Secret

```bash
# 1. Database URL (sostituisci con i tuoi valori)
echo -n "postgresql://vtn_user:your-password@/vietnamonamour?host=/cloudsql/$PROJECT_ID:europe-west1:vtn-postgres" | \
gcloud secrets create vtn-database-url --data-file=-

# 2. Session Secret (genera una chiave sicura)
echo -n "vtn-super-secret-session-key-32-chars-minimum-production" | \
gcloud secrets create vtn-session-secret --data-file=-

# 3. Google OAuth (se abilitato)
echo -n "your-google-client-id" | \
gcloud secrets create vtn-google-client-id --data-file=-

echo -n "your-google-client-secret" | \
gcloud secrets create vtn-google-client-secret --data-file=-
```

### 3.2 Verificare i Secret

```bash
# Lista tutti i secret
gcloud secrets list

# Verifica un secret specifico
gcloud secrets versions access latest --secret="vtn-database-url"
```

## 🔧 FASE 4: Configurazione Cloud Build

### 4.1 Connettere Repository GitHub

1. Vai su **Cloud Build** → **Trigger**
2. Clicca **"Crea trigger"**
3. Configurazione:
   - **Nome**: `vtn-backend-trigger`
   - **Evento**: Push su branch `main` (o `deploy-gcp-2`)
   - **Repository**: Seleziona il tuo repository GitHub
   - **File di configurazione**: `cloudbuild.yaml`
   - **Regione**: `europe-west1`

### 4.2 Testare il Build

```bash
# Testa il build localmente
gcloud builds submit --config cloudbuild.yaml .

# Oppure triggera manualmente dal trigger
gcloud builds triggers run vtn-backend-trigger --branch=main
```

## 🚀 FASE 5: Deploy su Cloud Run

### 5.1 Deploy Automatico

Il deploy avverrà automaticamente quando:
1. Fai push su GitHub
2. Cloud Build rileva il cambiamento
3. Esegue il build e deploy

### 5.2 Deploy Manuale (se necessario)

```bash
# Build e push dell'immagine
gcloud builds submit --tag gcr.io/$PROJECT_ID/vtn-backend .

# Deploy su Cloud Run
gcloud run deploy vtn-backend \
    --image gcr.io/$PROJECT_ID/vtn-backend \
    --region europe-west1 \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production,PORT=8080 \
    --set-secrets DATABASE_URL=vtn-database-url:latest,SESSION_SECRET=vtn-session-secret:latest
```

## 🗃️ FASE 6: Eseguire Migrazioni Database

### 6.1 Connessione al Database

```bash
# Connettiti all'istanza Cloud SQL
gcloud sql connect vtn-postgres --user=postgres --database=vietnamonamour
```

### 6.2 Eseguire Migrazioni Prisma

```bash
# Esegui le migrazioni (dalla directory del progetto)
npx prisma migrate deploy
```

**OPPURE** esegui le migrazioni tramite Cloud Run:

```bash
# Esegui comando Prisma su Cloud Run
gcloud run jobs create migrate-db \
    --image gcr.io/$PROJECT_ID/vtn-backend \
    --region europe-west1 \
    --set-secrets DATABASE_URL=vtn-database-url:latest \
    --command="npx" \
    --args="prisma,migrate,deploy" \
    --memory 1Gi \
    --cpu 1

# Esegui il job
gcloud run jobs execute migrate-db --region europe-west1
```

## 🔍 FASE 7: Verifica e Monitoraggio

### 7.1 Test dell'Applicazione

```bash
# Ottieni l'URL del servizio
SERVICE_URL=$(gcloud run services describe vtn-backend --region=europe-west1 --format="value(status.url)")

# Test health check
curl $SERVICE_URL/health

# Test readiness
curl $SERVICE_URL/health/ready

# Test liveness
curl $SERVICE_URL/health/live
```

### 7.2 Monitoraggio

1. **Logs**: Cloud Run → Servizi → vtn-backend → Logs
2. **Metriche**: Cloud Run → Servizi → vtn-backend → Metriche
3. **Database**: Cloud SQL → vtn-postgres → Monitoraggio

## 🛠️ FASE 8: Configurazioni Avanzate

### 8.1 Dominio Personalizzato

```bash
# Mappa un dominio personalizzato
gcloud run domain-mappings create \
    --service vtn-backend \
    --domain your-domain.com \
    --region europe-west1
```

### 8.2 SSL/TLS

Cloud Run gestisce automaticamente i certificati SSL per domini personalizzati.

### 8.3 Backup Database

```bash
# Crea backup manuale
gcloud sql backups create \
    --instance vtn-postgres \
    --description "Backup manuale $(date)"

# Configura backup automatici (già abilitato nello script)
```

## 🔧 FASE 9: Troubleshooting

### 9.1 Problemi Comuni

**Errore di connessione database:**
- Verifica che l'istanza Cloud SQL sia in esecuzione
- Controlla che il secret `vtn-database-url` sia corretto
- Verifica i permessi IAM per Cloud SQL

**Errore di build:**
- Controlla i log di Cloud Build
- Verifica che il Dockerfile sia corretto
- Assicurati che tutte le dipendenze siano in package.json

**Errore di deploy:**
- Verifica i secret in Secret Manager
- Controlla i permessi IAM per Cloud Run
- Verifica la configurazione di cloudbuild.yaml

### 9.2 Log e Debug

```bash
# Log di Cloud Run
gcloud run services logs read vtn-backend --region=europe-west1

# Log di Cloud Build
gcloud builds log [BUILD_ID]

# Log di Cloud SQL
gcloud sql operations list --instance=vtn-postgres
```

## 📊 FASE 10: Ottimizzazioni

### 10.1 Performance

- **Memory**: Aumenta se necessario (1Gi → 2Gi)
- **CPU**: Aumenta se necessario (1 → 2)
- **Concurrency**: Regola in base al carico
- **Min instances**: Imposta a 1 per ridurre cold start

### 10.2 Costi

- **Min instances**: 0 per risparmiare
- **Max instances**: Limita per controllare i costi
- **Database**: Usa `db-f1-micro` per sviluppo, scala per produzione

## ✅ Checklist Finale

- [ ] API GCP abilitate
- [ ] IAM configurato correttamente
- [ ] Cloud SQL istanza creata e configurata
- [ ] Database e utente creati
- [ ] Secret Manager configurato
- [ ] Cloud Build trigger configurato
- [ ] Deploy automatico funzionante
- [ ] Migrazioni database eseguite
- [ ] Health check funzionante
- [ ] Monitoraggio configurato
- [ ] Backup automatici abilitati

## 🆘 Supporto

Per problemi o domande:
1. Controlla i log di Cloud Run e Cloud Build
2. Verifica la configurazione IAM
3. Consulta la documentazione GCP
4. Controlla i secret in Secret Manager

---

**🎉 Congratulazioni! Il tuo backend Vietnamonamour è ora deployato su GCP!**
