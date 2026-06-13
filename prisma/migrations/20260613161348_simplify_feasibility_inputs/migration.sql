/*
  Warnings:

  - Added the required column `pricePerSqWah` to the `FeasibilityAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeasibilityAnalysis" ADD COLUMN     "pricePerSqWah" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "FeasibilityAnalysis" ALTER COLUMN "pricePerSqWah" DROP DEFAULT;
