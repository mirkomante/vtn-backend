-- Add bevande and cocktail to ElementiCancellati view
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
