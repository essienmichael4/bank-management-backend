/*
  Warnings:

  - A unique constraint covering the columns `[savingId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[loanId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "loanId" INTEGER,
ADD COLUMN     "savingId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_savingId_key" ON "Transaction"("savingId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_loanId_key" ON "Transaction"("loanId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_savingId_fkey" FOREIGN KEY ("savingId") REFERENCES "Saving"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
