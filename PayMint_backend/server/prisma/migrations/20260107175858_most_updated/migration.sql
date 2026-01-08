/*
  Warnings:

  - The `status` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('SUCCESS', 'PENDING', 'FAILED');

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'FEE';

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "status",
ADD COLUMN     "status" "StatusType" NOT NULL DEFAULT 'PENDING';
