/*
  Warnings:

  - You are about to drop the column `holidayRequestsId` on the `user_holidays` table. All the data in the column will be lost.
  - Added the required column `requestedDays` to the `holiday_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_holidays" DROP CONSTRAINT "user_holidays_holidayRequestsId_fkey";

-- AlterTable
ALTER TABLE "holiday_requests" ADD COLUMN     "description" TEXT,
ADD COLUMN     "requestedDays" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_holidays" DROP COLUMN "holidayRequestsId";
