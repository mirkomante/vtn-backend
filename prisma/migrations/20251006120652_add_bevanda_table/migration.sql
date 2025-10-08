-- CreateTable
CREATE TABLE "bevande" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "prezzo" DECIMAL(10,2) NOT NULL,
    "inLista" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nazioneId" TEXT NOT NULL,
    "tipologiaId" TEXT NOT NULL,

    CONSTRAINT "bevande_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bevande" ADD CONSTRAINT "bevande_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bevande" ADD CONSTRAINT "bevande_tipologiaId_fkey" FOREIGN KEY ("tipologiaId") REFERENCES "tipologie_bevanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
