-- CreateView
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
WHERE mf."deletedAt" IS NOT NULL; 