-- AlterTable
ALTER TABLE "piatti" ADD COLUMN     "glutenFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noLatticini" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vegan" BOOLEAN NOT NULL DEFAULT false;
