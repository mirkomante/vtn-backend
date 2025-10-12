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

### 3. Modelli Ristorante Menu

#### CategoriaPiatti
```typescript
model CategoriaPiatti {
  id          String    @id @default(uuid())
  nome        String    @unique
  descrizione String?
  inLista     Boolean   @default(true)
  deletedAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relazioni
  piatti      Piatto[]

  @@map("categoria_piatti")
}
```

**Campi:**
- `nome`: Nome della categoria (es. "Antipasti", "Primi Piatti")
- `descrizione`: Descrizione opzionale della categoria
- `inLista`: Se la categoria è visibile nel menu pubblico

#### Allergene
```typescript
model Allergene {
  id          String            @id @default(uuid())
  nome        String            @unique
  descrizione String?
  deletedAt   DateTime?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  // Relazioni
  piatti      PiattoAllergene[]

  @@map("allergeni")
}
```

**Campi:**
- `nome`: Nome dell'allergene (es. "Glutine", "Latte", "Uova")
- `descrizione`: Descrizione opzionale dell'allergene

#### Piatto
```typescript
model Piatto {
  id            String   @id @default(uuid())
  nome          String
  descrizione   String?
  prezzo        Decimal  @db.Decimal(10, 2)
  inLista       Boolean  @default(true)
  glutenFree    Boolean  @default(false)
  noLatticini   Boolean  @default(false)
  vegan         Boolean  @default(false)
  soloMenuFissi Boolean  @default(false)
  deletedAt     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relazioni
  categoriaId String
  categoria   CategoriaPiatti @relation(fields: [categoriaId], references: [id])
  
  allergeni   PiattoAllergene[]
  menuFissi   MenuFissoPiatto[]

  @@map("piatti")
}
```

**Campi:**
- `nome`: Nome del piatto
- `descrizione`: Descrizione opzionale del piatto
- `prezzo`: Prezzo del piatto (max 10 cifre, 2 decimali)
- `inLista`: Se il piatto è visibile nel menu pubblico
- `glutenFree`: Se il piatto è senza glutine
- `noLatticini`: Se il piatto non contiene latticini
- `vegan`: Se il piatto è vegano
- `soloMenuFissi`: Se il piatto è disponibile solo nei menu fissi (non nel menu pubblico)

**Relazioni:**
- `categoria`: Categoria del piatto (obbligatoria)
- `allergeni`: Allergeni del piatto (molti-a-molti)
- `menuFissi`: Menu fissi che includono questo piatto (molti-a-molti)

#### PiattoAllergene
```typescript
model PiattoAllergene {
  id          String    @id @default(uuid())
  piattoId    String
  allergeneId String
  createdAt   DateTime  @default(now())
  allergene   Allergene @relation(fields: [allergeneId], references: [id], onDelete: Cascade)
  piatto      Piatto    @relation(fields: [piattoId], references: [id], onDelete: Cascade)

  @@unique([piattoId, allergeneId])
  @@map("piatto_allergene")
}
```

**Relazioni:**
- `piatto`: Piatto (obbligatorio)
- `allergene`: Allergene (obbligatorio)

**Vincoli:**
- `@@unique([piattoId, allergeneId])`: Evita duplicati piatto-allergene

#### ServizioAccessorio
```typescript
model ServizioAccessorio {
  id          String                        @id @default(uuid())
  nome        String
  descrizione String?
  prezzo      Decimal                       @db.Decimal(10, 2)
  inLista     Boolean                       @default(true)
  deletedAt   DateTime?
  createdAt   DateTime                      @default(now())
  updatedAt   DateTime                      @updatedAt

  // Relazioni
  menuFissi   MenuFissoServizioAccessorio[]

  @@map("servizi_accessori")
}
```

**Campi:**
- `nome`: Nome del servizio (es. "Coperto", "Pane e Grissini")
- `descrizione`: Descrizione opzionale del servizio
- `prezzo`: Prezzo del servizio
- `inLista`: Se il servizio è visibile nel menu

#### CategoriaMenuFisso
```typescript
model CategoriaMenuFisso {
  id          String      @id @default(uuid())
  nome        String      @unique
  descrizione String?
  inLista     Boolean     @default(true)
  deletedAt   DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relazioni
  menuFissi   MenuFisso[]

  @@map("categoria_menu_fisso")
}
```

**Campi:**
- `nome`: Nome della categoria (es. "Menu Completi", "Menu Degustazione")
- `descrizione`: Descrizione opzionale della categoria
- `inLista`: Se la categoria è visibile nel menu

#### MenuFisso
```typescript
model MenuFisso {
  id          String                        @id @default(uuid())
  nome        String
  descrizione String?
  prezzo      Decimal                       @db.Decimal(10, 2)
  inLista     Boolean                       @default(true)
  deletedAt   DateTime?
  createdAt   DateTime                      @default(now())
  updatedAt   DateTime                      @updatedAt

  // Relazioni
  categoriaId String
  categoria   CategoriaMenuFisso            @relation(fields: [categoriaId], references: [id])
  piatti      MenuFissoPiatto[]
  servizi     MenuFissoServizioAccessorio[]

  @@map("menu_fisso")
}
```

**Campi:**
- `nome`: Nome del menu fisso
- `descrizione`: Descrizione opzionale del menu
- `prezzo`: Prezzo del menu fisso
- `inLista`: Se il menu è visibile nel menu pubblico

**Relazioni:**
- `categoria`: Categoria del menu fisso (obbligatoria)
- `piatti`: Piatti inclusi nel menu (molti-a-molti)
- `servizi`: Servizi inclusi nel menu (molti-a-molti)

#### MenuFissoPiatto
```typescript
model MenuFissoPiatto {
  id          String    @id @default(uuid())
  menuFissoId String
  piattoId    String
  createdAt   DateTime  @default(now())
  menuFisso   MenuFisso @relation(fields: [menuFissoId], references: [id], onDelete: Cascade)
  piatto      Piatto    @relation(fields: [piattoId], references: [id], onDelete: Cascade)

  @@unique([menuFissoId, piattoId])
  @@map("menu_fisso_piatto")
}
```

**Relazioni:**
- `menuFisso`: Menu fisso (obbligatorio)
- `piatto`: Piatto (obbligatorio)

**Vincoli:**
- `@@unique([menuFissoId, piattoId])`: Evita duplicati menu-piatto

#### MenuFissoServizioAccessorio
```typescript
model MenuFissoServizioAccessorio {
  id                   String             @id @default(uuid())
  menuFissoId          String
  servizioAccessorioId String
  createdAt            DateTime           @default(now())
  menuFisso            MenuFisso          @relation(fields: [menuFissoId], references: [id], onDelete: Cascade)
  servizioAccessorio   ServizioAccessorio @relation(fields: [servizioAccessorioId], references: [id], onDelete: Cascade)

  @@unique([menuFissoId, servizioAccessorioId])
  @@map("menu_fisso_servizio_accessorio")
}
```

**Relazioni:**
- `menuFisso`: Menu fisso (obbligatorio)
- `servizioAccessorio`: Servizio accessorio (obbligatorio)

**Vincoli:**
- `@@unique([menuFissoId, servizioAccessorioId])`: Evita duplicati menu-servizio

### 4. Modelli Bevande

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

### Relazioni Ristorante Menu
```
CategoriaPiatti (1) ──→ (N) Piatto
Allergene (1) ──→ (N) PiattoAllergene (N) ──→ (1) Piatto
MenuFisso (1) ──→ (N) MenuFissoPiatto (N) ──→ (1) Piatto
MenuFisso (1) ──→ (N) MenuFissoServizioAccessorio (N) ──→ (1) ServizioAccessorio
CategoriaMenuFisso (1) ──→ (N) MenuFisso
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

### Gestione Piatti "Solo Menu Fissi"
Il campo `soloMenuFissi` nel modello `Piatto` permette di distinguere tra:

#### Piatti Pubblici (`soloMenuFissi = false`)
- Visibili in tutti gli endpoint API pubblici
- Inclusi nel menu pubblico del ristorante
- Accessibili tramite tutti i filtri e le query

#### Piatti Solo Menu Fissi (`soloMenuFissi = true`)
- **NON** visibili negli endpoint API pubblici
- **NON** inclusi nel menu pubblico del ristorante
- Accessibili solo nei form di gestione menu fissi
- Possono essere inclusi nei menu fissi insieme ai piatti pubblici

#### Comportamento degli Endpoint
```sql
-- Query per endpoint pubblici (esclude piatti solo per menu fissi)
SELECT * FROM piatti 
WHERE deleted_at IS NULL 
  AND in_lista = true 
  AND solo_menu_fissi = false;

-- Query per gestione menu fissi (include tutti i piatti)
SELECT * FROM piatti 
WHERE deleted_at IS NULL 
  AND in_lista = true;
```

#### Vantaggi
1. **Separazione Chiara**: Distinzione netta tra menu pubblico e menu fissi
2. **Flessibilità**: I menu fissi possono includere piatti speciali non disponibili al pubblico
3. **Sicurezza**: I piatti solo per menu fissi non sono esposti pubblicamente
4. **Gestione Semplificata**: Nessun filtro manuale necessario negli endpoint pubblici

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

### Inserimento Piatto Pubblico
```sql
-- Inserimento piatto visibile nel menu pubblico
INSERT INTO piatti (
  nome, descrizione, prezzo, in_lista, gluten_free, no_latticini, vegan, solo_menu_fissi,
  categoria_id
) VALUES (
  'Spaghetti Carbonara',
  'Pasta con uova, pancetta e pecorino romano',
  14.00,
  true,
  false,
  false,
  false,
  false,  -- Piatto pubblico
  'uuid-categoria-primi'
);
```

### Inserimento Piatto Solo Menu Fissi
```sql
-- Inserimento piatto disponibile solo nei menu fissi
INSERT INTO piatti (
  nome, descrizione, prezzo, in_lista, gluten_free, no_latticini, vegan, solo_menu_fissi,
  categoria_id
) VALUES (
  'Tartufo Nero Tagliatelle',
  'Pasta fresca con tartufo nero di Norcia e burro',
  28.00,
  true,
  false,
  false,
  false,
  true,   -- Solo per menu fissi
  'uuid-categoria-primi'
);
```

### Inserimento Menu Fisso
```sql
-- Inserimento menu fisso che può includere piatti pubblici e solo per menu fissi
INSERT INTO menu_fisso (
  nome, descrizione, prezzo, in_lista, categoria_id
) VALUES (
  'Menu Degustazione Chef',
  'Menu completo con specialità del giorno',
  45.00,
  true,
  'uuid-categoria-menu-degustazione'
);

-- Collegamento piatti al menu fisso (sia pubblici che solo per menu fissi)
INSERT INTO menu_fisso_piatto (menu_fisso_id, piatto_id) VALUES
  ('uuid-menu-degustazione', 'uuid-piatto-carbonara'),      -- Piatto pubblico
  ('uuid-menu-degustazione', 'uuid-piatto-tartufo');       -- Piatto solo menu fissi
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

### Piatti per Categoria (Menu Pubblico)
```sql
-- Piatti visibili nel menu pubblico raggruppati per categoria
SELECT 
  c.nome as categoria,
  p.nome as piatto,
  p.prezzo,
  p.gluten_free,
  p.no_latticini,
  p.vegan
FROM piatti p
JOIN categoria_piatti c ON p.categoria_id = c.id
WHERE p.deleted_at IS NULL 
  AND p.in_lista = true 
  AND p.solo_menu_fissi = false  -- Solo piatti pubblici
ORDER BY c.nome, p.nome;
```

### Piatti Solo per Menu Fissi
```sql
-- Piatti disponibili solo nei menu fissi
SELECT 
  p.nome,
  p.descrizione,
  p.prezzo,
  c.nome as categoria
FROM piatti p
JOIN categoria_piatti c ON p.categoria_id = c.id
WHERE p.deleted_at IS NULL 
  AND p.in_lista = true 
  AND p.solo_menu_fissi = true  -- Solo piatti per menu fissi
ORDER BY c.nome, p.nome;
```

### Menu Fissi con Tutti i Piatti
```sql
-- Menu fissi con piatti (sia pubblici che solo per menu fissi)
SELECT 
  mf.nome as menu_fisso,
  mf.prezzo as prezzo_menu,
  p.nome as piatto,
  p.prezzo as prezzo_piatto,
  p.solo_menu_fissi,
  c.nome as categoria
FROM menu_fisso mf
JOIN menu_fisso_piatto mfp ON mf.id = mfp.menu_fisso_id
JOIN piatti p ON mfp.piatto_id = p.id
JOIN categoria_piatti c ON p.categoria_id = c.id
WHERE mf.deleted_at IS NULL 
  AND p.deleted_at IS NULL
ORDER BY mf.nome, c.nome, p.nome;
```

### Statistiche Piatti
```sql
-- Conteggio piatti per tipo
SELECT 
  CASE 
    WHEN solo_menu_fissi = true THEN 'Solo Menu Fissi'
    ELSE 'Pubblici'
  END as tipo,
  COUNT(*) as quantita
FROM piatti 
WHERE deleted_at IS NULL AND in_lista = true
GROUP BY solo_menu_fissi;
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
- `20250115000000_add_solo_menu_fissi_to_piatti` - Aggiunta campo soloMenuFissi ai piatti

## Considerazioni di Performance

### Indici
- Tutti i campi `id` sono indicizzati automaticamente (chiavi primarie)
- Campi `deletedAt` dovrebbero essere indicizzati per query di soft delete
- Campi `nome` con vincolo `@unique` sono automaticamente indicizzati
- Campo `soloMenuFissi` dovrebbe essere indicizzato per query di filtraggio piatti

### Query Ottimizzate
- Utilizzare sempre `WHERE deletedAt IS NULL` per elementi attivi
- Utilizzare `JOIN` invece di query separate per relazioni
- Considerare l'aggiunta di indici compositi per query frequenti
- Per endpoint pubblici: aggiungere sempre `AND soloMenuFissi = false` per escludere piatti solo per menu fissi
- Per gestione menu fissi: non filtrare per `soloMenuFissi` per includere tutti i piatti

### Scalabilità
- Il sistema supporta migliaia di bevande e piatti
- Le relazioni geografiche sono ottimizzate per query gerarchiche
- Il soft delete permette di mantenere storico senza impattare le performance
- La separazione tra piatti pubblici e solo per menu fissi migliora le performance delle query pubbliche

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
- Per endpoint pubblici: filtrare sempre `soloMenuFissi = false` per proteggere piatti riservati
- Per gestione menu fissi: verificare autorizzazioni prima di accedere a tutti i piatti
