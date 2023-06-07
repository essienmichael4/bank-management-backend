/*
  Warnings:

  - You are about to drop the column `name` on the `Guarantor` table. All the data in the column will be lost.
  - Added the required column `savingId` to the `Guarantor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Guarantor_loanId_key";

-- DropIndex
DROP INDEX "Loan_phone_key";

-- AlterTable
ALTER TABLE "Guarantor" DROP COLUMN "name",
ADD COLUMN     "savingId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Guarantor" ADD CONSTRAINT "Guarantor_savingId_fkey" FOREIGN KEY ("savingId") REFERENCES "Saving"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
