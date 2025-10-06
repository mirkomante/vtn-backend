# Schema Database VTN Backend

## Panoramica

Il database VTN Backend utilizza PostgreSQL con Prisma ORM e implementa un sistema completo per la gestione di un ristorante, inclusa la gestione delle bevande con indicazioni geografiche e tipologie.

## Struttura Generale

### Modelli Base
- **User**: Gestione utenti e autenticazione
- **Session**: Gestione sessioni utente

### Modelli Ristorante Menu
- **CategoriaPiatti**: Categorie per i piatti
- **CategoriaMenuFisso**: Categorie per i menu fissi
- **Allergene**: Sistema di gestione allergeni
- **Piatto**: Piatti del ristorante
- **PiattoAllergene**: Relazione molti-a-molti tra piatti e allergeni
- **ServizioAccessorio**: Servizi accessori del ristorante
- **MenuFisso**: Menu fissi del ristorante
- **MenuFissoPiatto**: Relazione molti-a-molti tra menu fissi e piatti
- **MenuFissoServizioAccessorio**: Relazione molti-a-molti tra menu fissi e servizi

### Modelli Geografici
- **Nazione**: Nazioni di produzione
- **Regione**: Regioni (solo per vini)
- **Zona**: Zone (solo per vini)

### Modelli Tipologie Bevande
- **TipologiaVino**: Tipi di vino (Rosso, Bianco, Rosato, Spumante)
- **TipologiaBirra**: Tipi di birra (Lager, Ale, Stout, IPA)
- **TipologiaLiquore**: Tipi di liquore (Whisky, Vodka, Gin, Rum)
- **TipologiaCocktail**: Tipi di cocktail (Classico, Moderno, Tropicale)
- **TipologiaBevanda**: Tipi di bevande analcoliche (Gassata, Succo, Tè, Caffè)

### Modelli Bevande
- **Vino**: Vini con indicazioni geografiche complete
- **Birra**: Birre con indicazione nazionale
- **Liquore**: Liquori con indicazione nazionale
- **Cocktail**: Cocktail con indicazione nazionale
- **Bevanda**: Bevande analcoliche con indicazione nazionale

## Modelli Dettagliati

### 1. Modelli Geografici

#### Nazione
```typescript
model Nazione {
  id          String   @id @default(uuid())
  nome        String   @unique
  sigla       String   @unique // Sigla di due lettere maiuscole (es. "IT", "FR")
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relazioni
  regioni     Regione[]
  zone        Zona[]
  vini        Vino[]
  birre       Birra[]
  liquori     Liquore[]
  cocktail    Cocktail[]
  bevande     Bevanda[]

  @@map("nazioni")
}
```

**Campi:**
- `nome`: Nome della nazione (es. "Italia", "Francia")
- `sigla`: Sigla ISO a due lettere (es. "IT", "FR")

#### Regione
```typescript
model Regione {
  id          String   @id @default(uuid())
  nome        String
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relazioni
  nazioneId   String
  nazione     Nazione @relation(fields: [nazioneId], references: [id])
  zone        Zona[]
  vini        Vino[]

  @@unique([nome, nazioneId])
  @@map("regioni")
}
```

**Campi:**
- `nome`: Nome della regione (es. "Toscana", "Piemonte")
- `nazioneId`: Chiave esterna verso Nazione

**Vincoli:**
- `@@unique([nome, nazioneId])`: Evita regioni duplicate nella stessa nazione

#### Zona
```typescript
model Zona {
  id          String   @id @default(uuid())
  nome        String
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relazioni
  regioneId   String
  regione     Regione @relation(fields: [regioneId], references: [id])
  
  nazioneId   String
  nazione     Nazione @relation(fields: [nazioneId], references: [id])
  
  vini        Vino[]

  @@unique([nome, regioneId])
  @@map("zone")
}
```

**Campi:**
- `nome`: Nome della zona (es. "Chianti", "Barolo")
- `regioneId`: Chiave esterna verso Regione
- `nazioneId`: Chiave esterna verso Nazione (per facilitare le query)

**Vincoli:**
- `@@unique([nome, regioneId])`: Evita zone duplicate nella stessa regione

### 2. Modelli Tipologie Bevande

#### TipologiaVino
```typescript
model TipologiaVino {
  id          String   @id @default(uuid())
  nome        String   @unique
  descrizione String?  // Testo lungo per descrizione dettagliata
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relazioni
  vini        Vino[]

  @@map("tipologie_vino")
}
```

**Esempi di tipologie:**
- Rosso
- Bianco
- Rosato
- Spumante
- Passito
- Moscato

#### TipologiaBirra
```typescript
model TipologiaBirra {
  id          String   @id @default(uuid())
  nome        String   @unique
  descrizione String?  // Testo lungo per descrizione dettagliata
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relazioni
  birre       Birra[]

  @@map("tipologie_birra")
}
```

**Esempi di tipologie:**
- Lager
- Ale
- Stout
- IPA
- Pilsner
- Weiss

#### TipologiaLiquore
```typescript
model TipologiaLiquore {
  id          String   @id @default(uuid())
  nome        String   @unique
  descrizione String?  // Testo lungo per descrizione dettagliata
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relazioni
  liquori     Liquore[]

  @@map("tipologie_liquore")
}
```

**Esempi di tipologie:**
- Whisky
- Vodka
- Gin
- Rum
- Brandy
- Cognac

#### TipologiaCocktail
```typescript
model TipologiaCocktail {
  id          String   @id @default(uuid())
  nome        String   @unique
  descrizione String?  // Testo lungo per descrizione dettagliata
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relazioni
  cocktail    Cocktail[]

  @@map("tipologie_cocktail")
}
```

**Esempi di tipologie:**
- Classico
- Moderno
- Tropicale
- Signature
- Seasonal

#### TipologiaBevanda
```typescript
model TipologiaBevanda {
  id          String   @id @default(uuid())
  nome        String   @unique
  descrizione String?  // Testo lungo per descrizione dettagliata
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relazioni
  bevande     Bevanda[]

  @@map("tipologie_bevanda")
}
```

**Esempi di tipologie:**
- Gassata
- Succo
- Tè
- Caffè
- Acqua
- Energetica

### 3. Modelli Bevande

#### Vino
```typescript
model Vino {
  id              String   @id @default(uuid())
  nome            String
  descrizione     String?
  cantina         String?
  grado           String?  // Grado alcolico (es. "13.5%", "12%")
  certificazione  String?
  capacita        String?  // Capacità (es. "750ml", "1L")
  prezzoCalice    Decimal? @db.Decimal(10, 2) // Prezzo per calice
  prezzo          Decimal  @db.Decimal(10, 2) // Prezzo bottiglia
  inLista         Boolean  @default(true)
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relazioni geografiche
  zonaId          String?
  zona            Zona? @relation(fields: [zonaId], references: [id])
  
  regioneId       String?
  regione         Regione? @relation(fields: [regioneId], references: [id])
  
  nazioneId       String
  nazione         Nazione @relation(fields: [nazioneId], references: [id])

  // Relazione tipologia
  tipologiaId     String
  tipologia       TipologiaVino @relation(fields: [tipologiaId], references: [id])

  @@map("vini")
}
```

**Campi specifici:**
- `cantina`: Nome della cantina produttrice
- `grado`: Grado alcolico (es. "13.5%", "12%")
- `certificazione`: Certificazione (es. DOC, DOCG, IGT)
- `capacita`: Capacità della bottiglia (es. "750ml", "1L")
- `prezzoCalice`: Prezzo per calice (opzionale)
- `prezzo`: Prezzo della bottiglia

**Relazioni geografiche:**
- `zona`: Zona di produzione (opzionale)
- `regione`: Regione di produzione (opzionale)
- `nazione`: Nazione di produzione (obbligatoria)

#### Birra
```typescript
model Birra {
  id              String   @id @default(uuid())
  nome            String
  descrizione     String?
  grado           String?  // Grado alcolico (es. "5.2%", "4.5%")
  capacita        String?  // Capacità (es. "33cl", "50cl", "1L")
  prezzo          Decimal  @db.Decimal(10, 2) // Prezzo
  inLista         Boolean  @default(true)
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relazioni geografiche
  nazioneId       String
  nazione         Nazione @relation(fields: [nazioneId], references: [id])

  // Relazione tipologia
  tipologiaId     String
  tipologia       TipologiaBirra @relation(fields: [tipologiaId], references: [id])

  @@map("birre")
}
```

**Campi specifici:**
- `grado`: Grado alcolico (es. "5.2%", "4.5%")
- `capacita`: Capacità (es. "33cl", "50cl", "1L")

**Relazioni geografiche:**
- `nazione`: Nazione di produzione (obbligatoria)

#### Liquore
```typescript
model Liquore {
  id              String   @id @default(uuid())
  nome            String
  descrizione     String?
  grado           String?  // Grado alcolico (es. "40%", "35%")
  invecchiamento  String?  // Invecchiamento (es. "12 anni", "8 mesi", "Non invecchiato")
  capacita        String?  // Capacità (es. "50ml", "70cl", "1L")
  prezzo          Decimal  @db.Decimal(10, 2) // Prezzo
  inLista         Boolean  @default(true)
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relazioni geografiche
  nazioneId       String
  nazione         Nazione @relation(fields: [nazioneId], references: [id])

  // Relazione tipologia
  tipologiaId     String
  tipologia       TipologiaLiquore @relation(fields: [tipologiaId], references: [id])

  @@map("liquori")
}
```

**Campi specifici:**
- `grado`: Grado alcolico (es. "40%", "35%")
- `invecchiamento`: Invecchiamento (es. "12 anni", "8 mesi", "Non invecchiato")
- `capacita`: Capacità (es. "50ml", "70cl", "1L")

**Relazioni geografiche:**
- `nazione`: Nazione di produzione (obbligatoria)

#### Cocktail
```typescript
model Cocktail {
  id              String   @id @default(uuid())
  nome            String
  descrizione     String?
  prezzo          Decimal  @db.Decimal(10, 2) // Prezzo
  inLista         Boolean  @default(true)
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relazioni geografiche
  nazioneId       String
  nazione         Nazione @relation(fields: [nazioneId], references: [id])

  // Relazione tipologia
  tipologiaId     String
  tipologia       TipologiaCocktail @relation(fields: [tipologiaId], references: [id])

  @@map("cocktail")
}
```

**Campi specifici:**
- Struttura semplificata con solo i campi essenziali

**Relazioni geografiche:**
- `nazione`: Nazione di origine del cocktail (obbligatoria)

#### Bevanda
```typescript
model Bevanda {
  id              String   @id @default(uuid())
  nome            String
  descrizione     String?
  prezzo          Decimal  @db.Decimal(10, 2) // Prezzo
  inLista         Boolean  @default(true)
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relazioni geografiche
  nazioneId       String
  nazione         Nazione @relation(fields: [nazioneId], references: [id])

  // Relazione tipologia
  tipologiaId     String
  tipologia       TipologiaBevanda @relation(fields: [tipologiaId], references: [id])

  @@map("bevande")
}
```

**Campi specifici:**
- Struttura semplificata con solo i campi essenziali

**Relazioni geografiche:**
- `nazione`: Nazione di produzione (obbligatoria)

## Relazioni del Database

### Gerarchia Geografica
```
Nazione (1) ──→ (N) Regione (1) ──→ (N) Zona
    │
    └─── (N) Vino (solo vini hanno regione e zona)
    └─── (N) Birra
    └─── (N) Liquore
    └─── (N) Cocktail
    └─── (N) Bevanda
```

### Relazioni Tipologie
```
TipologiaVino (1) ──→ (N) Vino
TipologiaBirra (1) ──→ (N) Birra
TipologiaLiquore (1) ──→ (N) Liquore
TipologiaCocktail (1) ──→ (N) Cocktail
TipologiaBevanda (1) ──→ (N) Bevanda
```

## Caratteristiche Speciali

### Soft Delete
Tutti i modelli implementano il soft delete tramite il campo `deletedAt`:
- `deletedAt: null` = elemento attivo
- `deletedAt: DateTime` = elemento cancellato logicamente

### Campi Standard
Tutti i modelli includono:
- `id`: Chiave primaria UUID
- `deletedAt`: Per soft delete
- `createdAt`: Timestamp di creazione
- `updatedAt`: Timestamp di aggiornamento

### Indicazioni Geografiche
- **Vini**: Supportano indicazioni geografiche complete (Nazione → Regione → Zona)
- **Altre Bevande**: Supportano solo indicazione nazionale

### Gestione Prezzi
- **Vini**: Supportano prezzo bottiglia e prezzo calice
- **Altre Bevande**: Supportano solo prezzo singolo

## Esempi di Utilizzo

### Inserimento Vino Completo
```sql
-- Inserimento vino con indicazioni geografiche complete
INSERT INTO vini (
  nome, descrizione, cantina, grado, certificazione, capacita,
  prezzo_calice, prezzo, in_lista,
  nazione_id, regione_id, zona_id, tipologia_id
) VALUES (
  'Chianti Classico',
  'Vino rosso toscano con profumi di ciliegia e spezie',
  'Antinori',
  '13.5%',
  'DOCG',
  '750ml',
  8.50,
  25.00,
  true,
  'uuid-nazione-italia',
  'uuid-regione-toscana',
  'uuid-zona-chianti',
  'uuid-tipologia-rosso'
);
```

### Inserimento Birra
```sql
-- Inserimento birra con indicazione nazionale
INSERT INTO birre (
  nome, descrizione, grado, capacita, prezzo, in_lista,
  nazione_id, tipologia_id
) VALUES (
  'Peroni Nastro Azzurro',
  'Birra lager italiana dal sapore delicato e rinfrescante',
  '4.7%',
  '33cl',
  4.50,
  true,
  'uuid-nazione-italia',
  'uuid-tipologia-lager'
);
```

### Inserimento Liquore
```sql
-- Inserimento liquore con invecchiamento
INSERT INTO liquori (
  nome, descrizione, grado, invecchiamento, capacita, prezzo, in_lista,
  nazione_id, tipologia_id
) VALUES (
  'Johnnie Walker Black Label',
  'Whisky scozzese dal sapore equilibrato e complesso',
  '40%',
  '12 anni',
  '70cl',
  45.00,
  true,
  'uuid-nazione-scozia',
  'uuid-tipologia-whisky'
);
```

## Query Utili

### Vini per Regione
```sql
SELECT v.nome, v.cantina, v.prezzo, r.nome as regione, n.nome as nazione
FROM vini v
JOIN regioni r ON v.regione_id = r.id
JOIN nazioni n ON v.nazione_id = n.id
WHERE v.deleted_at IS NULL
ORDER BY r.nome, v.nome;
```

### Bevande per Tipologia
```sql
-- Birre Lager
SELECT b.nome, b.grado, b.prezzo, n.nome as nazione
FROM birre b
JOIN tipologie_birra tb ON b.tipologia_id = tb.id
JOIN nazioni n ON b.nazione_id = n.id
WHERE tb.nome = 'Lager' AND b.deleted_at IS NULL
ORDER BY b.nome;
```

### Statistiche Bevande
```sql
-- Conteggio bevande per tipologia
SELECT 
  'Vini' as tipo, COUNT(*) as quantita
FROM vini WHERE deleted_at IS NULL
UNION ALL
SELECT 
  'Birre' as tipo, COUNT(*) as quantita
FROM birre WHERE deleted_at IS NULL
UNION ALL
SELECT 
  'Liquori' as tipo, COUNT(*) as quantita
FROM liquori WHERE deleted_at IS NULL
UNION ALL
SELECT 
  'Cocktail' as tipo, COUNT(*) as quantita
FROM cocktail WHERE deleted_at IS NULL
UNION ALL
SELECT 
  'Bevande' as tipo, COUNT(*) as quantita
FROM bevande WHERE deleted_at IS NULL;
```

## Migrazioni

### Applicare Migrazioni
```bash
# Genera una nuova migrazione
npx prisma migrate dev --name nome_migrazione

# Applica le migrazioni in produzione
npx prisma migrate deploy

# Reset del database (sviluppo)
npx prisma migrate reset
```

### Migrazioni Disponibili
- `20250726090604_migrations` - Migrazioni iniziali
- `20250726161327_add_given_family_name` - Aggiunta campi nome utente
- `20250727081552_add_soft_delete` - Implementazione soft delete
- `20250729155834_add_ristorante_menu_models` - Modelli ristorante menu
- `20250802181645_remove_inlista_from_allergeni` - Rimozione inLista da allergeni
- `20250803000000_create_deleted_items_view` - Vista elementi cancellati
- `20251006094705_add_geographic_tables` - Tabelle geografiche
- `20251006113500_add_tipologie_tables` - Tabelle tipologie bevande
- `20251006114954_add_vino_table` - Tabella vini
- `20251006115629_add_birra_table` - Tabella birre
- `20251006120238_add_liquore_table` - Tabella liquori
- `20251006120450_add_cocktail_table` - Tabella cocktail
- `20251006120652_add_bevanda_table` - Tabella bevande analcoliche
- `20251006115843_add_grado_to_vino` - Aggiunta campo grado ai vini

## Considerazioni di Performance

### Indici
- Tutti i campi `id` sono indicizzati automaticamente (chiavi primarie)
- Campi `deletedAt` dovrebbero essere indicizzati per query di soft delete
- Campi `nome` con vincolo `@unique` sono automaticamente indicizzati

### Query Ottimizzate
- Utilizzare sempre `WHERE deletedAt IS NULL` per elementi attivi
- Utilizzare `JOIN` invece di query separate per relazioni
- Considerare l'aggiunta di indici compositi per query frequenti

### Scalabilità
- Il sistema supporta migliaia di bevande
- Le relazioni geografiche sono ottimizzate per query gerarchiche
- Il soft delete permette di mantenere storico senza impattare le performance

## Sicurezza

### Validazione
- Tutti i campi obbligatori sono validati a livello di schema
- I vincoli `@unique` prevengono duplicati
- Le relazioni foreign key garantiscono integrità referenziale

### Soft Delete
- Il soft delete previene perdite accidentali di dati
- Permette il ripristino di elementi cancellati per errore
- Mantiene tracciabilità delle cancellazioni

### Accesso ai Dati
- Utilizzare sempre filtri `deletedAt IS NULL` per dati attivi
- Implementare controlli di autorizzazione a livello applicativo
- Validare input utente prima delle operazioni database
