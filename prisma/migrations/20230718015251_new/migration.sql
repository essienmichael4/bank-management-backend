/*
  Warnings:

  - A unique constraint covering the columns `[office]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `balanceAmount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "card" TEXT;

-- AlterTable
ALTER TABLE "Saving" ADD COLUMN     "card" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "balanceAmount" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Department_office_key" ON "Department"("office");
