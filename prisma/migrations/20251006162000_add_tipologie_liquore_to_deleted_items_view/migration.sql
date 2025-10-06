-- Add tipologie liquore to ElementiCancellati view
CREATE OR REPLACE VIEW "ElementiCancellati" AS
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

SELECT
  r.id,
  r.nome,
  COALESCE(n.nome, '') as descrizione,
  r."deletedAt" as "deletedAt",
  r."createdAt" as "createdAt",
  r."updatedAt" as "updatedAt",
  'regione' as type,
  'Regione' as type_label,
  n.nome as categoria_nome
FROM "regioni" r
LEFT JOIN "nazioni" n ON r."nazioneId" = n.id
WHERE r."deletedAt" IS NOT NULL

UNION ALL

SELECT
  z.id,
  z.nome,
  COALESCE(r.nome, '') as descrizione,
  z."deletedAt" as "deletedAt",
  z."createdAt" as "createdAt",
  z."updatedAt" as "updatedAt",
  'zona' as type,
  'Zona' as type_label,
  COALESCE(n.nome, '') as categoria_nome
FROM "zone" z
LEFT JOIN "regioni" r ON z."regioneId" = r.id
LEFT JOIN "nazioni" n ON r."nazioneId" = n.id
WHERE z."deletedAt" IS NOT NULL

UNION ALL

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
WHERE "deletedAt" IS NOT NULL;
