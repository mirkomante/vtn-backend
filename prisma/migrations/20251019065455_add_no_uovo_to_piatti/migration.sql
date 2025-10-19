-- DropForeignKey
ALTER TABLE "public"."bevande" DROP CONSTRAINT "bevande_nazioneId_fkey";

-- DropForeignKey
ALTER TABLE "public"."cocktail" DROP CONSTRAINT "cocktail_nazioneId_fkey";

-- DropForeignKey
ALTER TABLE "public"."vini" DROP CONSTRAINT "vini_regioneId_fkey";

-- DropForeignKey
ALTER TABLE "public"."vini" DROP CONSTRAINT "vini_zonaId_fkey";

-- DropIndex
DROP INDEX "public"."idx_logs_category_timestamp";

-- DropIndex
DROP INDEX "public"."idx_logs_level_timestamp";

-- DropIndex
DROP INDEX "public"."idx_logs_metadata_gin";

-- AlterTable
ALTER TABLE "piatti" ADD COLUMN     "noUovo" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "vini" ADD CONSTRAINT "vini_regioneId_fkey" FOREIGN KEY ("regioneId") REFERENCES "regioni"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vini" ADD CONSTRAINT "vini_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktail" ADD CONSTRAINT "cocktail_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bevande" ADD CONSTRAINT "bevande_nazioneId_fkey" FOREIGN KEY ("nazioneId") REFERENCES "nazioni"("id") ON DELETE SET NULL ON UPDATE CASCADE;
