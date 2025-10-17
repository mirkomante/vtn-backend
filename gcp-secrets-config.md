# ===========================================
# CONFIGURAZIONE SECRET MANAGER - VIETNAMONAMOUR
# ===========================================

## Variabili Sensibili da Configurare in Secret Manager

### 1. DATABASE_URL
- **Nome Secret**: `vtn-database-url`
- **Descrizione**: URL di connessione completo a Cloud SQL PostgreSQL
- **Formato**: `postgresql://username:password@/database?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME`
- **Esempio**: `postgresql://vtn_user:secure_password@/vietnamonamour?host=/cloudsql/vtn-project:europe-west1:vtn-postgres`

### 2. SESSION_SECRET
- **Nome Secret**: `vtn-session-secret`
- **Descrizione**: Chiave segreta per le sessioni Express (minimo 32 caratteri)
- **Formato**: Stringa alfanumerica casuale
- **Esempio**: `vtn-super-secret-session-key-32-chars-minimum-production`

### 3. GOOGLE_CLIENT_ID
- **Nome Secret**: `vtn-google-client-id`
- **Descrizione**: Client ID per Google OAuth 2.0
- **Formato**: Stringa alfanumerica da Google Cloud Console
- **Esempio**: `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`

### 4. GOOGLE_CLIENT_SECRET
- **Nome Secret**: `vtn-google-client-secret`
- **Descrizione**: Client Secret per Google OAuth 2.0
- **Formato**: Stringa alfanumerica da Google Cloud Console
- **Esempio**: `GOCSPX-abcdefghijklmnopqrstuvwxyz123456`

## Variabili Non Sensibili (Environment Variables)

Queste variabili possono essere impostate direttamente in Cloud Run:

```bash
NODE_ENV=production
PORT=8080
AUTH_LOCAL_ENABLED=true
AUTH_GOOGLE_ENABLED=true
MENU_RISTORANTE=true
MENU_ADMIN=true
```

## Comandi per Creare i Secret

```bash
# 1. Database URL
echo -n "postgresql://vtn_user:secure_password@/vietnamonamour?host=/cloudsql/vtn-project:europe-west1:vtn-postgres" | \
gcloud secrets create vtn-database-url --data-file=-

# 2. Session Secret
echo -n "vtn-super-secret-session-key-32-chars-minimum-production" | \
gcloud secrets create vtn-session-secret --data-file=-

# 3. Google Client ID
echo -n "your-google-client-id" | \
gcloud secrets create vtn-google-client-id --data-file=-

# 4. Google Client Secret
echo -n "your-google-client-secret" | \
gcloud secrets create vtn-google-client-secret --data-file=-
```

## Permessi IAM Necessari

Il service account di Cloud Run deve avere questi ruoli:
- `roles/secretmanager.secretAccessor`
- `roles/cloudsql.client`
- `roles/logging.logWriter`
- `roles/monitoring.metricWriter`
