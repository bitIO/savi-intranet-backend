-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'REJECTED', 'APPROVED');

-- AlterTable
ALTER TABLE "holidays" ADD COLUMN     "comments" TEXT[],
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
