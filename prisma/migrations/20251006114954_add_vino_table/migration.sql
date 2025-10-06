-- CreateTable
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

    CONSTRAINT "vini_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vini" ADD CONSTRAINT "vini_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vini" ADD CONSTRAINT "vini_regioneId_fkey" FOREIGN KEY ("regioneId") REFERENCES "regioni"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vini" ADD CONSTRAINT "vini_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vini" ADD CONSTRAINT "vini_tipologiaId_fkey" FOREIGN KEY ("tipologiaId") REFERENCES "tipologie_vino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
