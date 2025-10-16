-- ==============================================
-- VTN BACKEND - MIGRAZIONE CONSOLIDATA v1.0.0
-- ==============================================
-- Questa migrazione sostituisce tutte le 24 migrazioni di sviluppo
-- con una singola migrazione ottimizzata per la produzione
-- Data: 2025-01-15
-- Versione: 1.0.0

-- ==============================================
-- TABELLE BASE
-- ==============================================

-- Tabella User (con tutti i campi finali)
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "googleId" TEXT,
    "authProvider" TEXT NOT NULL DEFAULT 'local',
    "auth" TEXT NOT NULL DEFAULT 'user',
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "familyName" TEXT,
    "givenName" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Tabella Session
CREATE TABLE "session" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- ==============================================
-- TABELLE RISTORANTE
-- ==============================================

-- Categorie Piatti
CREATE TABLE "categoria_piatti" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoria_piatti_pkey" PRIMARY KEY ("id")
);

-- Categorie Menu Fisso
CREATE TABLE "categoria_menu_fisso" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoria_menu_fisso_pkey" PRIMARY KEY ("id")
);

-- Allergeni (senza inLista)
CREATE TABLE "allergeni" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allergeni_pkey" PRIMARY KEY ("id")
);

-- Piatti (con tutti i campi dietetici e soloMenuFissi)
CREATE TABLE "piatti" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "prezzo" DECIMAL(10,2) NOT NULL,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "glutenFree" BOOLEAN NOT NULL DEFAULT false,
    "noLatticini" BOOLEAN NOT NULL DEFAULT false,
    "vegan" BOOLEAN NOT NULL DEFAULT false,
    "soloMenuFissi" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "piatti_pkey" PRIMARY KEY ("id")
);

-- Servizi Accessori
CREATE TABLE "servizi_accessori" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "prezzo" DECIMAL(10,2) NOT NULL,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servizi_accessori_pkey" PRIMARY KEY ("id")
);

-- Menu Fisso
CREATE TABLE "menu_fisso" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "prezzo" DECIMAL(10,2) NOT NULL,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "menu_fisso_pkey" PRIMARY KEY ("id")
);

-- ==============================================
-- TABELLE GEOGRAFICHE
-- ==============================================

-- Nazioni
CREATE TABLE "nazioni" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nazioni_pkey" PRIMARY KEY ("id")
);

-- Regioni
CREATE TABLE "regioni" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nazioneId" TEXT NOT NULL,

    CONSTRAINT "regioni_pkey" PRIMARY KEY ("id")
);

-- Zone
CREATE TABLE "zone" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "regioneId" TEXT NOT NULL,
    "nazioneId" TEXT NOT NULL,

    CONSTRAINT "zone_pkey" PRIMARY KEY ("id")
);

-- ==============================================
-- TABELLE TIPOLOGIE
-- ==============================================

-- Tipologie Vino
CREATE TABLE "tipologie_vino" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipologie_vino_pkey" PRIMARY KEY ("id")
);

-- Tipologie Birra
CREATE TABLE "tipologie_birra" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipologie_birra_pkey" PRIMARY KEY ("id")
);

-- Tipologie Liquore
CREATE TABLE "tipologie_liquore" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipologie_liquore_pkey" PRIMARY KEY ("id")
);

-- Tipologie Cocktail
CREATE TABLE "tipologie_cocktail" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipologie_cocktail_pkey" PRIMARY KEY ("id")
);

-- Tipologie Bevanda
CREATE TABLE "tipologie_bevanda" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipologie_bevanda_pkey" PRIMARY KEY ("id")
);

-- ==============================================
-- TABELLE BEVANDE
-- ==============================================

-- Vini (con grado e anno)
CREATE TABLE "vini" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "cantina" TEXT,
    "certificazione" TEXT,
    "capacita" TEXT,
    "prezzoCalice" DECIMAL(10,2),
    "prezzo" DECIMAL(10,2) NOT NULL,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "zonaId" TEXT,
    "regioneId" TEXT,
    "nazioneId" TEXT NOT NULL,
    "tipologiaId" TEXT NOT NULL,
    "grado" TEXT,
    "anno" TEXT,

    CONSTRAINT "vini_pkey" PRIMARY KEY ("id")
);

-- Birre
CREATE TABLE "birre" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "grado" TEXT,
    "capacita" TEXT,
    "prezzo" DECIMAL(10,2) NOT NULL,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nazioneId" TEXT NOT NULL,
    "tipologiaId" TEXT NOT NULL,

    CONSTRAINT "birre_pkey" PRIMARY KEY ("id")
);

-- Liquori
CREATE TABLE "liquori" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "grado" TEXT,
    "invecchiamento" TEXT,
    "capacita" TEXT,
    "prezzo" DECIMAL(10,2) NOT NULL,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nazioneId" TEXT NOT NULL,
    "tipologiaId" TEXT NOT NULL,

    CONSTRAINT "liquori_pkey" PRIMARY KEY ("id")
);

-- Cocktail
CREATE TABLE "cocktail" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "prezzo" DECIMAL(10,2) NOT NULL,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nazioneId" TEXT,
    "tipologiaId" TEXT NOT NULL,

    CONSTRAINT "cocktail_pkey" PRIMARY KEY ("id")
);

-- Bevande
CREATE TABLE "bevande" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "prezzo" DECIMAL(10,2) NOT NULL,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nazioneId" TEXT,
    "tipologiaId" TEXT NOT NULL,

    CONSTRAINT "bevande_pkey" PRIMARY KEY ("id")
);

-- ==============================================
-- TABELLE RELAZIONI
-- ==============================================

-- Piatto Allergene
CREATE TABLE "piatto_allergene" (
    "id" TEXT NOT NULL,
    "piattoId" TEXT NOT NULL,
    "allergeneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "piatto_allergene_pkey" PRIMARY KEY ("id")
);

-- Menu Fisso Piatto
CREATE TABLE "menu_fisso_piatto" (
    "id" TEXT NOT NULL,
    "menuFissoId" TEXT NOT NULL,
    "piattoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_fisso_piatto_pkey" PRIMARY KEY ("id")
);

-- Menu Fisso Servizio Accessorio
CREATE TABLE "menu_fisso_servizio_accessorio" (
    "id" TEXT NOT NULL,
    "menuFissoId" TEXT NOT NULL,
    "servizioAccessorioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_fisso_servizio_accessorio_pkey" PRIMARY KEY ("id")
);

-- ==============================================
-- TABELLA LOGS
-- ==============================================

CREATE TABLE "logs" (
    "id" BIGSERIAL NOT NULL,
    "level" VARCHAR(10) NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" VARCHAR(20) NOT NULL,
    "request_id" VARCHAR(100),
    "user_id" VARCHAR(100),
    "ip_address" INET,
    "user_agent" TEXT,
    "method" VARCHAR(10),
    "url" TEXT,
    "status_code" INTEGER,
    "duration" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- ==============================================
-- INDICI
-- ==============================================

-- Indici User
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- Indici Categorie
CREATE UNIQUE INDEX "categoria_piatti_nome_key" ON "categoria_piatti"("nome");
CREATE UNIQUE INDEX "categoria_menu_fisso_nome_key" ON "categoria_menu_fisso"("nome");
CREATE UNIQUE INDEX "allergeni_nome_key" ON "allergeni"("nome");

-- Indici Geografici
CREATE UNIQUE INDEX "nazioni_nome_key" ON "nazioni"("nome");
CREATE UNIQUE INDEX "nazioni_sigla_key" ON "nazioni"("sigla");
CREATE UNIQUE INDEX "regioni_nome_nazioneId_key" ON "regioni"("nome", "nazioneId");
CREATE UNIQUE INDEX "zone_nome_regioneId_key" ON "zone"("nome", "regioneId");

-- Indici Tipologie
CREATE UNIQUE INDEX "tipologie_vino_nome_key" ON "tipologie_vino"("nome");
CREATE UNIQUE INDEX "tipologie_birra_nome_key" ON "tipologie_birra"("nome");
CREATE UNIQUE INDEX "tipologie_liquore_nome_key" ON "tipologie_liquore"("nome");
CREATE UNIQUE INDEX "tipologie_cocktail_nome_key" ON "tipologie_cocktail"("nome");
CREATE UNIQUE INDEX "tipologie_bevanda_nome_key" ON "tipologie_bevanda"("nome");

-- Indici Relazioni
CREATE UNIQUE INDEX "piatto_allergene_piattoId_allergeneId_key" ON "piatto_allergene"("piattoId", "allergeneId");
CREATE UNIQUE INDEX "menu_fisso_piatto_menuFissoId_piattoId_key" ON "menu_fisso_piatto"("menuFissoId", "piattoId");
CREATE UNIQUE INDEX "menu_fisso_servizio_accessorio_menuFissoId_servizioAccessor_key" ON "menu_fisso_servizio_accessorio"("menuFissoId", "servizioAccessorioId");

-- Indici Logs (ottimizzati per performance)
CREATE INDEX "idx_logs_category_timestamp" ON "logs"("category", "timestamp" DESC);
CREATE INDEX "idx_logs_level_timestamp" ON "logs"("level", "timestamp" DESC);
CREATE INDEX "idx_logs_request_id" ON "logs"("request_id") WHERE "request_id" IS NOT NULL;
CREATE INDEX "idx_logs_user_id" ON "logs"("user_id") WHERE "user_id" IS NOT NULL;
CREATE INDEX "idx_logs_url" ON "logs"("url") WHERE "url" IS NOT NULL;
CREATE INDEX "idx_logs_metadata_gin" ON "logs" USING GIN ("metadata");

-- ==============================================
-- FOREIGN KEYS
-- ==============================================

-- Piatti
ALTER TABLE "piatti" ADD CONSTRAINT "piatti_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria_piatti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Piatto Allergene
ALTER TABLE "piatto_allergene" ADD CONSTRAINT "piatto_allergene_piattoId_fkey" FOREIGN KEY ("piattoId") REFERENCES "piatti"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "piatto_allergene" ADD CONSTRAINT "piatto_allergene_allergeneId_fkey" FOREIGN KEY ("allergeneId") REFERENCES "allergeni"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Menu Fisso
ALTER TABLE "menu_fisso" ADD CONSTRAINT "menu_fisso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria_menu_fisso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Menu Fisso Piatto
ALTER TABLE "menu_fisso_piatto" ADD CONSTRAINT "menu_fisso_piatto_menuFissoId_fkey" FOREIGN KEY ("menuFissoId") REFERENCES "menu_fisso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu_fisso_piatto" ADD CONSTRAINT "menu_fisso_piatto_piattoId_fkey" FOREIGN KEY ("piattoId") REFERENCES "piatti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Menu Fisso Servizio Accessorio
ALTER TABLE "menu_fisso_servizio_accessorio" ADD CONSTRAINT "menu_fisso_servizio_accessorio_menuFissoId_fkey" FOREIGN KEY ("menuFissoId") REFERENCES "menu_fisso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu_fisso_servizio_accessorio" ADD CONSTRAINT "menu_fisso_servizio_accessorio_servizioAccessorioId_fkey" FOREIGN KEY ("servizioAccessorioId") REFERENCES "servizi_accessori"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Geografici
ALTER TABLE "regioni" ADD CONSTRAINT "regioni_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "zone" ADD CONSTRAINT "zone_regioneId_fkey" FOREIGN KEY ("regioneId") REFERENCES "regioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "zone" ADD CONSTRAINT "zone_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Bevande
ALTER TABLE "vini" ADD CONSTRAINT "vini_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "vini" ADD CONSTRAINT "vini_regioneId_fkey" FOREIGN KEY ("regioneId") REFERENCES "regioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "vini" ADD CONSTRAINT "vini_tipologiaId_fkey" FOREIGN KEY ("tipologiaId") REFERENCES "tipologie_vino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "vini" ADD CONSTRAINT "vini_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "birre" ADD CONSTRAINT "birre_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "birre" ADD CONSTRAINT "birre_tipologiaId_fkey" FOREIGN KEY ("tipologiaId") REFERENCES "tipologie_birra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "liquori" ADD CONSTRAINT "liquori_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "liquori" ADD CONSTRAINT "liquori_tipologiaId_fkey" FOREIGN KEY ("tipologiaId") REFERENCES "tipologie_liquore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "cocktail" ADD CONSTRAINT "cocktail_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cocktail" ADD CONSTRAINT "cocktail_tipologiaId_fkey" FOREIGN KEY ("tipologiaId") REFERENCES "tipologie_cocktail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "bevande" ADD CONSTRAINT "bevande_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "bevande" ADD CONSTRAINT "bevande_tipologiaId_fkey" FOREIGN KEY ("tipologiaId") REFERENCES "tipologie_bevanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ==============================================
-- VISTA ELEMENTI CANCELLATI (COMPLETA)
-- ==============================================

CREATE OR REPLACE VIEW "ElementiCancellati" AS
-- Categorie Piatti
SELECT 
  id,
  nome,
  COALESCE(descrizione, '') as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'categoria-piatti' as type,
  'Categoria Piatti' as type_label,
  NULL as categoria_nome
FROM "categoria_piatti" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Categorie Menu Fisso
SELECT 
  id,
  nome,
  COALESCE(descrizione, '') as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'categoria-menu-fisso' as type,
  'Categoria Menu Fisso' as type_label,
  NULL as categoria_nome
FROM "categoria_menu_fisso" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Allergeni
SELECT 
  id,
  nome,
  COALESCE(descrizione, '') as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'allergene' as type,
  'Allergene' as type_label,
  NULL as categoria_nome
FROM "allergeni" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Piatti
SELECT 
  p.id,
  p.nome,
  COALESCE(p.descrizione, '') as descrizione,
  p."deletedAt" as "deletedAt",
  p."createdAt" as "createdAt",
  p."updatedAt" as "updatedAt",
  'piatto' as type,
  'Piatto' as type_label,
  cp.nome as categoria_nome
FROM "piatti" p
LEFT JOIN "categoria_piatti" cp ON p."categoriaId" = cp.id
WHERE p."deletedAt" IS NOT NULL

UNION ALL

-- Servizi Accessori
SELECT 
  id,
  nome,
  COALESCE(descrizione, '') as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'servizio-accessorio' as type,
  'Servizio Accessorio' as type_label,
  NULL as categoria_nome
FROM "servizi_accessori" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Menu Fisso
SELECT 
  mf.id,
  mf.nome,
  COALESCE(mf.descrizione, '') as descrizione,
  mf."deletedAt" as "deletedAt",
  mf."createdAt" as "createdAt",
  mf."updatedAt" as "updatedAt",
  'menu-fisso' as type,
  'Menu Fisso' as type_label,
  cmf.nome as categoria_nome
FROM "menu_fisso" mf
LEFT JOIN "categoria_menu_fisso" cmf ON mf."categoriaId" = cmf.id
WHERE mf."deletedAt" IS NOT NULL

UNION ALL

-- Nazioni
SELECT 
  id,
  nome,
  COALESCE(sigla, '') as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'nazione' as type,
  'Nazione' as type_label,
  NULL as categoria_nome
FROM "nazioni" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Regioni
SELECT 
  id,
  nome,
  '' as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'regione' as type,
  'Regione' as type_label,
  NULL as categoria_nome
FROM "regioni" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Zone
SELECT 
  id,
  nome,
  '' as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'zona' as type,
  'Zona' as type_label,
  NULL as categoria_nome
FROM "zone" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Tipologie Vino
SELECT 
  id,
  nome,
  COALESCE(descrizione, '') as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'tipologia-vino' as type,
  'Tipologia Vino' as type_label,
  NULL as categoria_nome
FROM "tipologie_vino" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Tipologie Birra
SELECT 
  id,
  nome,
  COALESCE(descrizione, '') as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'tipologia-birra' as type,
  'Tipologia Birra' as type_label,
  NULL as categoria_nome
FROM "tipologie_birra" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Tipologie Liquore
SELECT 
  id,
  nome,
  COALESCE(descrizione, '') as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'tipologia-liquore' as type,
  'Tipologia Liquore' as type_label,
  NULL as categoria_nome
FROM "tipologie_liquore" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Tipologie Cocktail
SELECT 
  id,
  nome,
  COALESCE(descrizione, '') as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'tipologia-cocktail' as type,
  'Tipologia Cocktail' as type_label,
  NULL as categoria_nome
FROM "tipologie_cocktail" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Tipologie Bevanda
SELECT 
  id,
  nome,
  COALESCE(descrizione, '') as descrizione,
  "deletedAt" as "deletedAt",
  "createdAt" as "createdAt",
  "updatedAt" as "updatedAt",
  'tipologia-bevanda' as type,
  'Tipologia Bevanda' as type_label,
  NULL as categoria_nome
FROM "tipologie_bevanda" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

-- Vini
SELECT 
  v.id,
  v.nome,
  COALESCE(v.descrizione, '') as descrizione,
  v."deletedAt" as "deletedAt",
  v."createdAt" as "createdAt",
  v."updatedAt" as "updatedAt",
  'vino' as type,
  'Vino' as type_label,
  tv.nome as categoria_nome
FROM "vini" v
LEFT JOIN "tipologie_vino" tv ON v."tipologiaId" = tv.id
WHERE v."deletedAt" IS NOT NULL

UNION ALL

-- Birre
SELECT 
  b.id,
  b.nome,
  COALESCE(b.descrizione, '') as descrizione,
  b."deletedAt" as "deletedAt",
  b."createdAt" as "createdAt",
  b."updatedAt" as "updatedAt",
  'birra' as type,
  'Birra' as type_label,
  tb.nome as categoria_nome
FROM "birre" b
LEFT JOIN "tipologie_birra" tb ON b."tipologiaId" = tb.id
WHERE b."deletedAt" IS NOT NULL

UNION ALL

-- Liquori
SELECT 
  l.id,
  l.nome,
  COALESCE(l.descrizione, '') as descrizione,
  l."deletedAt" as "deletedAt",
  l."createdAt" as "createdAt",
  l."updatedAt" as "updatedAt",
  'liquore' as type,
  'Liquore' as type_label,
  tl.nome as categoria_nome
FROM "liquori" l
LEFT JOIN "tipologie_liquore" tl ON l."tipologiaId" = tl.id
WHERE l."deletedAt" IS NOT NULL

UNION ALL

-- Cocktail
SELECT 
  c.id,
  c.nome,
  COALESCE(c.descrizione, '') as descrizione,
  c."deletedAt" as "deletedAt",
  c."createdAt" as "createdAt",
  c."updatedAt" as "updatedAt",
  'cocktail' as type,
  'Cocktail' as type_label,
  tc.nome as categoria_nome
FROM "cocktail" c
LEFT JOIN "tipologie_cocktail" tc ON c."tipologiaId" = tc.id
WHERE c."deletedAt" IS NOT NULL

UNION ALL

-- Bevande
SELECT 
  b.id,
  b.nome,
  COALESCE(b.descrizione, '') as descrizione,
  b."deletedAt" as "deletedAt",
  b."createdAt" as "createdAt",
  b."updatedAt" as "updatedAt",
  'bevanda' as type,
  'Bevanda' as type_label,
  tb.nome as categoria_nome
FROM "bevande" b
LEFT JOIN "tipologie_bevanda" tb ON b."tipologiaId" = tb.id
WHERE b."deletedAt" IS NOT NULL;
