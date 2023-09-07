/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DepartmentToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoanDetail" DROP CONSTRAINT "LoanDetail_grantedBy_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_transactedBy_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentToUser" DROP CONSTRAINT "_DepartmentToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentToUser" DROP CONSTRAINT "_DepartmentToUser_B_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_DepartmentToUser";

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "phone" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "othernames" TEXT,
    "status" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientToDepartment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_username_key" ON "Client"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Client_employeeId_key" ON "Client"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_key" ON "Client"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToDepartment_AB_unique" ON "_ClientToDepartment"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToDepartment_B_index" ON "_ClientToDepartment"("B");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transactedBy_fkey" FOREIGN KEY ("transactedBy") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanDetail" ADD CONSTRAINT "LoanDetail_grantedBy_fkey" FOREIGN KEY ("grantedBy") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToDepartment" ADD CONSTRAINT "_ClientToDepartment_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToDepartment" ADD CONSTRAINT "_ClientToDepartment_B_fkey" FOREIGN KEY ("B") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
