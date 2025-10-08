-- CreateTable
CREATE TABLE "nazioni" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nazioni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regioni" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nazioneId" TEXT NOT NULL,

    CONSTRAINT "regioni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "nazioni_nome_key" ON "nazioni"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "nazioni_sigla_key" ON "nazioni"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "regioni_nome_nazioneId_key" ON "regioni"("nome", "nazioneId");

-- CreateIndex
CREATE UNIQUE INDEX "zone_nome_regioneId_key" ON "zone"("nome", "regioneId");

-- AddForeignKey
ALTER TABLE "regioni" ADD CONSTRAINT "regioni_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_regioneId_fkey" FOREIGN KEY ("regioneId") REFERENCES "regioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
