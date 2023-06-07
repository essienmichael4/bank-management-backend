/*
  Warnings:

  - Changed the type of `state` on the `LoanDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LoanState" AS ENUM ('NEW', 'GRANTED', 'UNGRANTED', 'CLOSED');

-- DropForeignKey
ALTER TABLE "LoanDetail" DROP CONSTRAINT "LoanDetail_grantedBy_fkey";

-- AlterTable
ALTER TABLE "LoanDetail" DROP COLUMN "state",
ADD COLUMN     "state" "LoanState" NOT NULL,
ALTER COLUMN "grantedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LoanDetail" ADD CONSTRAINT "LoanDetail_grantedBy_fkey" FOREIGN KEY ("grantedBy") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
