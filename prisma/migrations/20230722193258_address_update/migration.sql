/*
  Warnings:

  - Added the required column `interestPercent` to the `LoanDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoanDetail" ADD COLUMN     "interestPercent" DOUBLE PRECISION NOT NULL;
