-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "allergeni" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allergeni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "piatti" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "prezzo" DECIMAL(10,2) NOT NULL,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "piatti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "piatto_allergene" (
    "id" TEXT NOT NULL,
    "piattoId" TEXT NOT NULL,
    "allergeneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "piatto_allergene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "menu_fisso_piatto" (
    "id" TEXT NOT NULL,
    "menuFissoId" TEXT NOT NULL,
    "piattoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_fisso_piatto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_fisso_servizio_accessorio" (
    "id" TEXT NOT NULL,
    "menuFissoId" TEXT NOT NULL,
    "servizioAccessorioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_fisso_servizio_accessorio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categoria_piatti_nome_key" ON "categoria_piatti"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_menu_fisso_nome_key" ON "categoria_menu_fisso"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "allergeni_nome_key" ON "allergeni"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "piatto_allergene_piattoId_allergeneId_key" ON "piatto_allergene"("piattoId", "allergeneId");

-- CreateIndex
CREATE UNIQUE INDEX "menu_fisso_piatto_menuFissoId_piattoId_key" ON "menu_fisso_piatto"("menuFissoId", "piattoId");

-- CreateIndex
CREATE UNIQUE INDEX "menu_fisso_servizio_accessorio_menuFissoId_servizioAccessor_key" ON "menu_fisso_servizio_accessorio"("menuFissoId", "servizioAccessorioId");

-- AddForeignKey
ALTER TABLE "piatti" ADD CONSTRAINT "piatti_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria_piatti"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "piatto_allergene" ADD CONSTRAINT "piatto_allergene_piattoId_fkey" FOREIGN KEY ("piattoId") REFERENCES "piatti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "piatto_allergene" ADD CONSTRAINT "piatto_allergene_allergeneId_fkey" FOREIGN KEY ("allergeneId") REFERENCES "allergeni"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_fisso" ADD CONSTRAINT "menu_fisso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria_menu_fisso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_fisso_piatto" ADD CONSTRAINT "menu_fisso_piatto_menuFissoId_fkey" FOREIGN KEY ("menuFissoId") REFERENCES "menu_fisso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_fisso_piatto" ADD CONSTRAINT "menu_fisso_piatto_piattoId_fkey" FOREIGN KEY ("piattoId") REFERENCES "piatti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_fisso_servizio_accessorio" ADD CONSTRAINT "menu_fisso_servizio_accessorio_menuFissoId_fkey" FOREIGN KEY ("menuFissoId") REFERENCES "menu_fisso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_fisso_servizio_accessorio" ADD CONSTRAINT "menu_fisso_servizio_accessorio_servizioAccessorioId_fkey" FOREIGN KEY ("servizioAccessorioId") REFERENCES "servizi_accessori"("id") ON DELETE CASCADE ON UPDATE CASCADE;
