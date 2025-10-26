# Manuale d'Uso per Amministratori - VTN Backend

## 📋 Indice

1. [Introduzione](#introduzione)
2. [Accesso al Sistema](#accesso-al-sistema)
3. [Sistema di Ruoli e Permessi](#sistema-di-ruoli-e-permessi)
4. [Gestione Utenti](#gestione-utenti)
   - [Aggiungere un Nuovo Utente con Google OAuth](#aggiungere-un-nuovo-utente-con-google-oauth)
   - [Aggiungere un Nuovo Utente Locale](#aggiungere-un-nuovo-utente-locale)
   - [Gestire Utenti Esistenti](#gestire-utenti-esistenti)
5. [Gestione Menu Ristorante](#gestione-menu-ristorante)
   - [Servizi Accessori](#servizi-accessori)
   - [Impostazioni](#impostazioni)
     - [Allergeni](#allergeni)
     - [Categorie Menu Fisso](#categorie-menu-fisso)
     - [Categorie Piatti](#categorie-piatti)
6. [Gestione Elementi Cancellati](#gestione-elementi-cancellati)
7. [Sistema di Notifiche](#sistema-di-notifiche)
8. [Troubleshooting](#troubleshooting)

---

## Introduzione

Benvenuto nel **Manuale d'Uso per Amministratori** del sistema VTN Backend. Questo manuale ti guiderà attraverso tutte le funzionalità disponibili per la gestione del sistema di ristorante.

### Cosa Puoi Fare

Il sistema utilizza un sistema di ruoli con due livelli principali:

- **👑 ADMIN**: Accesso completo al sistema, inclusa la gestione utenti
- **👤 USER**: Accesso completo al menu ristorante, senza gestione utenti

**Come amministratore, hai accesso completo a:**
- **Gestione Utenti**: Creazione e gestione di utenti del sistema
- **Menu Ristorante**: Gestione completa del menu e delle configurazioni
- **Impostazioni**: Configurazione di allergeni, categorie e servizi
- **Recupero Dati**: Gestione degli elementi cancellati

**Come utente normale, hai accesso a:**
- **Menu Ristorante**: Gestione completa del menu e delle configurazioni
- **Impostazioni**: Configurazione di allergeni, categorie e servizi
- **Recupero Dati**: Gestione degli elementi cancellati

---

## Accesso al Sistema

### Primo Accesso

1. **Se Google OAuth è abilitato**:
   - Clicca su "Accedi con Google"
   - Il primo utente che accede diventa automaticamente amministratore
   - Non è necessaria alcuna configurazione aggiuntiva

2. **Se solo autenticazione locale è abilitata**:
   - Vai alla pagina di login
   - Usa le credenziali predefinite:
     - **Email**: `admin@vietnamonamour.com`
     - **Password**: Contatta il team tecnico per la password iniziale

### Accessi Successivi

- **Google OAuth**: Clicca su "Accedi con Google" e usa il tuo account Google
- **Autenticazione Locale**: Usa email e password configurate

---

## Sistema di Ruoli e Permessi

### Panoramica del Sistema

Il sistema VTN Backend utilizza un sistema di ruoli basato su due livelli principali:

- **👑 ADMIN**: Accesso completo al sistema, inclusa la gestione utenti
- **👤 USER**: Accesso completo al menu ristorante, senza gestione utenti

### Assegnazione Automatica dei Ruoli

#### Per Utenti Google OAuth

Quando un utente con email `@vietnamonamour.com` accede per la prima volta:

1. **Se è il primo utente del sistema** → diventa automaticamente **ADMIN**
2. **Se esistono già admin** → diventa **USER** normale
3. **Se è un utente esistente** → mantiene il suo ruolo attuale

#### Per Utenti Locali

Gli utenti locali vengono creati manualmente dagli amministratori con il ruolo specificato durante la creazione.

### Permessi per Ruolo

#### 👑 **Ruolo ADMIN**

**Menu Disponibili:**
- ✅ **Ristorante: Menu** - Accesso completo
- ✅ **Admin** - Accesso completo

**Funzionalità Disponibili:**
- **Gestione Utenti**: Creazione, modifica, eliminazione di utenti
- **Gestione Menu Ristorante**: Accesso completo a tutti i contenuti
- **Gestione Impostazioni**: Configurazione completa del sistema
- **Gestione Elementi Cancellati**: Ripristino ed eliminazione definitiva

#### 👤 **Ruolo USER**

**Menu Disponibili:**
- ✅ **Ristorante: Menu** - Accesso completo
- ❌ **Admin** - Accesso negato

**Funzionalità Disponibili:**
- **Gestione Menu Ristorante**: Accesso completo a tutti i contenuti
- **Gestione Impostazioni**: Configurazione completa del sistema
- **Gestione Elementi Cancellati**: Ripristino ed eliminazione definitiva

### Operazioni Specifiche per Ruolo

#### **Operazioni Disponibili per Entrambi i Ruoli**

**Servizi Accessori:**
- ✅ Creare nuovi servizi
- ✅ Modificare servizi esistenti
- ✅ Eliminare servizi (soft delete)
- ✅ Modifica massiva di servizi
- ✅ Visualizzare dettagli servizi

**Impostazioni:**
- ✅ **Allergeni**: CRUD completo
- ✅ **Categorie Menu Fisso**: CRUD completo + modifica massiva
- ✅ **Categorie Piatti**: CRUD completo + modifica massiva

**Gestione Elementi Cancellati:**
- ✅ Visualizzare elementi cancellati
- ✅ Ripristinare elementi cancellati
- ✅ Eliminazione definitiva di elementi cancellati

#### **Operazioni Solo per ADMIN**

**Gestione Utenti:**
- ✅ Visualizzare lista utenti
- ✅ Creare nuovi utenti (locali)
- ✅ Modificare utenti esistenti
- ✅ Cambiare ruoli utenti (user ↔ admin)
- ✅ Eliminare utenti
- ✅ Modifica massiva utenti

### Controlli di Accesso

#### **Middleware di Autenticazione**

Il sistema implementa controlli di accesso a più livelli:

1. **Autenticazione**: Verifica che l'utente sia loggato
2. **Autorizzazione**: Verifica che l'utente abbia il ruolo necessario
3. **Menu Access**: Filtra i menu visibili in base al ruolo

#### **Controlli Specifici**

- **Menu Admin**: Accessibile solo a utenti con ruolo `admin`
- **Menu Ristorante**: Accessibile a tutti gli utenti autenticati
- **Route Protette**: Middleware `isAdmin` per operazioni amministrative

### Gestione dei Ruoli

#### **Cambio Ruolo per Utenti Esistenti**

Gli amministratori possono modificare il ruolo di qualsiasi utente:

1. Vai in **Admin** → **Utenti**
2. Clicca sul nome dell'utente da modificare
3. Clicca su **"Modifica"**
4. Cambia il campo **"Ruolo"**:
   - `admin` - Accesso completo al sistema
   - `user` - Accesso limitato al menu ristorante
5. Clicca su **"Salva Modifiche"**

#### **Modifica Massiva Ruoli**

Per cambiare il ruolo di più utenti contemporaneamente:

1. **Seleziona gli utenti** dalla lista
2. Clicca su **"Modifica"**
3. Seleziona il nuovo ruolo nel campo **"Ruolo"**
4. Clicca su **"Salva Modifiche"**

### Sicurezza e Best Practices

#### **Raccomandazioni per Amministratori**

- **Monitora regolarmente** la lista utenti per verificare accessi non autorizzati
- **Assegna il ruolo admin** solo a personale autorizzato
- **Rimuovi immediatamente** utenti che non dovrebbero avere accesso
- **Documenta** i cambiamenti di ruolo per audit

#### **Gestione Account Google**

- **Revoca accesso Google** per dipendenti che lasciano l'azienda
- **Monitora** gli accessi tramite log di Google Workspace
- **Considera** l'implementazione di una whitelist se necessario

#### **Backup e Recupero**

- **Gli utenti eliminati** possono essere ripristinati dalla sezione "Cancellati"
- **I ruoli modificati** vengono tracciati nei log del sistema
- **Le modifiche** sono immediatamente effettive

---

## Gestione Utenti

### Aggiungere un Nuovo Utente con Google OAuth

Questa è la procedura **raccomandata** per aggiungere nuovi utenti al sistema.

#### Prerequisiti
- L'utente deve avere un account Google valido
- Google OAuth deve essere abilitato nel sistema

#### Procedura

1. **Comunica all'utente**:
   - Fornisci l'URL del sistema
   - Spiega che deve usare "Accedi con Google"
   - Informa che il primo accesso creerà automaticamente il suo account

2. **L'utente accede**:
   - Va alla pagina di login del sistema
   - Clicca su "Accedi con Google"
   - Autorizza l'applicazione quando richiesto
   - Viene automaticamente reindirizzato al sistema

3. **Sistema automatico**:
   - **Se è un nuovo utente**: Viene creato automaticamente nel sistema
     - Se è il primo utente del sistema → diventa **admin**
     - Se esistono già admin → diventa **user** normale
   - **Se è un utente esistente**: Accede direttamente con il suo ruolo
   - I dati vengono estratti automaticamente da Google (nome, cognome, email, foto profilo)

4. **Verifica** (opzionale):
   - Vai in **Admin** → **Utenti**
   - Verifica che l'utente sia stato creato correttamente
   - Se necessario, puoi modificare il ruolo da "user" ad "admin"

#### Vantaggi di Google OAuth
- ✅ **Zero configurazione**: L'utente si registra autonomamente
- ✅ **Dati automatici**: Nome, cognome, email e foto profilo importati automaticamente
- ✅ **Sicurezza**: Password gestita da Google
- ✅ **Facilità**: Un solo click per accedere

#### ⚠️ Considerazioni di Sicurezza

**Registrazione Automatica**: Il sistema attuale permette a **chiunque** con un account Google di registrarsi automaticamente. Non c'è un sistema di "whitelist" o approvazione preventiva.

**Implicazioni**:
- ✅ **Vantaggio**: Facilità d'uso massima per gli utenti
- ⚠️ **Attenzione**: Qualsiasi persona con Google può accedere al sistema
- 🔧 **Gestione**: Gli admin devono monitorare periodicamente la lista utenti e rimuovere account non autorizzati se necessario

**Raccomandazioni**:
- Controlla regolarmente la lista utenti in **Admin** → **Utenti**
- Rimuovi account non autorizzati se necessario
- Considera l'implementazione di una whitelist se la sicurezza è critica

### Aggiungere un Nuovo Utente Locale

Usa questa procedura solo se Google OAuth non è disponibile o per utenti specifici.

#### Procedura

1. **Accedi come amministratore**

2. **Vai alla sezione Utenti**:
   - Clicca su **Admin** nel menu principale
   - Clicca su **Utenti**

3. **Crea nuovo utente**:
   - Clicca su **"Nuovo Utente"**
   - Compila il form con:
     - **Nome**: Nome dell'utente
     - **Cognome**: Cognome dell'utente
     - **Email**: Email univoca (verrà usata per il login)
     - **Password**: Password sicura (minimo 8 caratteri, maiuscole, minuscole, numeri)
     - **Ruolo**: 
       - `admin` - Accesso completo al sistema
       - `user` - Accesso limitato

4. **Salva**:
   - Clicca su **"Crea Utente"**
   - Il sistema mostrerà un messaggio di conferma

#### Requisiti Password
- **Lunghezza minima**: 8 caratteri
- **Deve contenere**: Almeno una lettera maiuscola, una minuscola e un numero
- **Caratteri speciali**: Consigliati ma non obbligatori

### Gestire Utenti Esistenti

#### Visualizzare Utenti

1. Vai in **Admin** → **Utenti**
2. Visualizza la lista di tutti gli utenti con:
   - Nome e cognome
   - Email
   - Ruolo
   - Data di creazione
   - Ultimo accesso

#### Modificare un Utente

1. **Dalla lista utenti**:
   - Clicca sul nome dell'utente per vedere i dettagli
   - Clicca su **"Modifica"**

2. **Modifica i campi**:
   - Nome e cognome
   - Email (deve essere univoca)
   - Ruolo (admin/user)
   - Password (opzionale - lascia vuoto per non cambiarla)

3. **Salva le modifiche**

#### Eliminare un Utente

⚠️ **Attenzione**: L'eliminazione è permanente e non può essere annullata.

1. Dalla lista utenti, clicca su **"Elimina"** accanto all'utente
2. Conferma l'eliminazione
3. L'utente verrà rimosso dal sistema

#### Modifica Massiva

Per modificare più utenti contemporaneamente:

1. **Seleziona gli utenti**:
   - Spunta le checkbox degli utenti da modificare
   - Clicca su **"Modifica"**

2. **Modifica i campi**:
   - Solo i campi selezionati verranno aggiornati
   - Lascia vuoti i campi che non vuoi modificare

3. **Salva le modifiche**

---

## Gestione Menu Ristorante

### Servizi Accessori

I servizi accessori sono servizi aggiuntivi del ristorante (es. coperto, servizio al tavolo, etc.).

#### Visualizzare Servizi

1. Vai in **Ristorante Menu** → **Servizi**
2. Visualizza tutti i servizi con:
   - Nome del servizio
   - Descrizione
   - Prezzo
   - Stato (Attivo/Inattivo)

#### Aggiungere un Servizio

1. Clicca su **"Nuovo Servizio"**
2. Compila il form:
   - **Nome**: Nome del servizio (es. "Coperto")
   - **Descrizione**: Descrizione opzionale
   - **Prezzo**: Prezzo in euro (es. 2.50)
   - **In Lista**: Spunta se il servizio deve essere visibile nel menu
3. Clicca su **"Crea Servizio"**

#### Modificare un Servizio

1. Clicca sul nome del servizio dalla lista
2. Clicca su **"Modifica"**
3. Modifica i campi necessari
4. Clicca su **"Salva Modifiche"**

#### Modifica Massiva Servizi

Per modificare più servizi contemporaneamente:

1. **Seleziona i servizi** dalla lista
2. Clicca su **"Modifica"**
3. Modifica i campi desiderati (solo prezzo e stato "In Lista")
4. Clicca su **"Salva Modifiche"**

#### Eliminare Servizi

- **Eliminazione singola**: Clicca su "Elimina" accanto al servizio
- **Eliminazione multipla**: Seleziona i servizi e clicca su "Elimina"

⚠️ **Nota**: L'eliminazione è "soft delete" - i servizi vengono nascosti ma non eliminati permanentemente.

### Impostazioni

Le impostazioni contengono le configurazioni di base del ristorante.

#### Allergeni

Gestisci gli allergeni presenti nei piatti del ristorante.

##### Aggiungere un Allergene

1. Vai in **Ristorante Menu** → **Impostazioni** → **Allergeni**
2. Clicca su **"Nuovo Allergene"**
3. Compila:
   - **Nome**: Nome dell'allergene (es. "Glutine")
   - **Descrizione**: Descrizione opzionale
4. Clicca su **"Crea Allergene"**

##### Gestire Allergeni

- **Visualizzare**: Lista con nome e descrizione
- **Modificare**: Clicca sul nome dell'allergene → "Modifica"
- **Eliminare**: Clicca su "Elimina" accanto all'allergene

#### Categorie Menu Fisso

Gestisci le categorie per i menu fissi del ristorante.

##### Aggiungere una Categoria

1. Vai in **Ristorante Menu** → **Impostazioni** → **Categoria Menu Fisso**
2. Clicca su **"Nuova Categoria"**
3. Compila:
   - **Nome**: Nome della categoria (es. "Antipasti")
   - **Descrizione**: Descrizione opzionale
   - **In Lista**: Spunta se la categoria deve essere visibile
4. Clicca su **"Crea Categoria"**

##### Modifica Massiva Categorie

1. **Seleziona le categorie** dalla lista
2. Clicca su **"Modifica"**
3. Modifica solo il campo **"In Lista"** (Attivo/Inattivo)
4. Clicca su **"Salva Modifiche"**

#### Categorie Piatti

Gestisci le categorie per i piatti del ristorante.

##### Aggiungere una Categoria

1. Vai in **Ristorante Menu** → **Impostazioni** → **Categoria Piatti**
2. Clicca su **"Nuova Categoria"**
3. Compila:
   - **Nome**: Nome della categoria (es. "Primi Piatti")
   - **Descrizione**: Descrizione opzionale
   - **In Lista**: Spunta se la categoria deve essere visibile
4. Clicca su **"Crea Categoria"**

##### Modifica Massiva Categorie

Procedura identica alle categorie menu fisso.

---

## Gestione Elementi Cancellati

Il sistema implementa un "soft delete" - gli elementi eliminati non vengono cancellati permanentemente ma nascosti.

### Visualizzare Elementi Cancellati

1. Vai in **Ristorante Menu** → **Cancellati**
2. Visualizza tutti gli elementi eliminati con:
   - Nome dell'elemento
   - Tipo (Servizio, Allergene, Categoria, etc.)
   - Descrizione
   - Data di cancellazione

### Filtrare Elementi

- **Per tipo**: Usa il dropdown per filtrare per tipo di elemento
- **Per data**: Gli elementi sono ordinati per data di cancellazione

### Ripristinare Elementi

1. **Seleziona gli elementi** da ripristinare
2. Clicca su **"Ripristina"** (bottone verde)
3. Conferma l'operazione
4. Gli elementi torneranno visibili nelle liste normali

### Eliminazione Definitiva

⚠️ **ATTENZIONE**: Questa operazione è **IRREVERSIBILE**.

1. **Seleziona gli elementi** da eliminare definitivamente
2. Clicca su **"Elimina Definitivamente"** (bottone rosso)
3. **Conferma due volte** l'operazione
4. Gli elementi verranno rimossi permanentemente dal database

---

## Sistema di Notifiche

Il sistema utilizza un sistema di notifiche "toast" per fornire feedback all'utente.

### Tipi di Notifiche

- **✅ Successo** (verde): Operazione completata con successo
- **❌ Errore** (rosso): Si è verificato un errore
- **⚠️ Avviso** (giallo): Attenzione richiesta
- **ℹ️ Informazione** (blu): Informazioni generali

### Comportamento

- Le notifiche appaiono automaticamente in alto a destra
- Si chiudono automaticamente dopo 5 secondi
- Puoi chiuderle manualmente cliccando sulla "X"
- Le notifiche di errore rimangono visibili più a lungo

---

## Troubleshooting

### Problemi Comuni

#### "Non riesco ad accedere con Google"

**Possibili cause**:
- Google OAuth non è configurato correttamente
- L'account Google non è autorizzato

**Soluzioni**:
1. Contatta il team tecnico per verificare la configurazione
2. Prova con un altro account Google
3. Usa l'autenticazione locale se disponibile

#### "Password non valida" per utenti locali

**Requisiti password**:
- Minimo 8 caratteri
- Almeno una lettera maiuscola
- Almeno una lettera minuscola
- Almeno un numero

#### "Email già esistente"

**Causa**: Stai tentando di creare un utente con un'email già utilizzata.

**Soluzione**: Usa un'email diversa o modifica l'utente esistente.

#### "Elemento non trovato"

**Possibili cause**:
- L'elemento è stato eliminato
- L'elemento è stato spostato
- URL non corretto

**Soluzioni**:
1. Verifica nella lista degli elementi
2. Controlla nella sezione "Cancellati"
3. Aggiorna la pagina

#### "Utente non autorizzato ha accesso al sistema"

**Causa**: Il sistema Google OAuth permette registrazione automatica a chiunque.

**Soluzioni**:
1. **Immediata**: Vai in **Admin** → **Utenti**
2. **Identifica** l'utente non autorizzato
3. **Elimina** l'account cliccando su "Elimina"
4. **Preventiva**: Considera di disabilitare Google OAuth se la sicurezza è critica
5. **Monitoraggio**: Controlla regolarmente la lista utenti per nuovi accessi non autorizzati

#### "Errore durante il salvataggio"

**Possibili cause**:
- Connessione di rete instabile
- Server temporaneamente non disponibile
- Dati non validi

**Soluzioni**:
1. Verifica la connessione internet
2. Riprova l'operazione
3. Controlla che tutti i campi obbligatori siano compilati
4. Contatta il team tecnico se il problema persiste

### Contatti per Supporto

- **Email tecnica**: [Inserire email di supporto]
- **Telefono**: [Inserire numero di telefono]
- **Orari supporto**: [Inserire orari di disponibilità]

---

## Note Importanti

### Sicurezza

- **Non condividere** le tue credenziali di accesso
- **Logout** sempre quando hai finito di usare il sistema
- **Cambia la password** periodicamente (per utenti locali)
- **Contatta il supporto** se sospetti accessi non autorizzati

### Backup

- Il sistema esegue backup automatici dei dati
- Gli elementi eliminati sono recuperabili per 30 giorni
- Contatta il team tecnico per backup personalizzati

### Aggiornamenti

- Il sistema viene aggiornato automaticamente
- Le nuove funzionalità saranno comunicate via email
- Consulta il changelog per dettagli sugli aggiornamenti

---

**Ultimo aggiornamento**: 2024-01-15  
**Versione manuale**: 1.0.0
