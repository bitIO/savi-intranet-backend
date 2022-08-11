-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'APPROVE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role"[] DEFAULT ARRAY['USER']::"Role"[];
