-- CreateTable
CREATE TABLE "tipologie_vino" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipologie_vino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipologie_birra" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipologie_birra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipologie_liquore" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipologie_liquore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipologie_cocktail" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipologie_cocktail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipologie_bevanda" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipologie_bevanda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipologie_vino_nome_key" ON "tipologie_vino"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tipologie_birra_nome_key" ON "tipologie_birra"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tipologie_liquore_nome_key" ON "tipologie_liquore"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tipologie_cocktail_nome_key" ON "tipologie_cocktail"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tipologie_bevanda_nome_key" ON "tipologie_bevanda"("nome");
