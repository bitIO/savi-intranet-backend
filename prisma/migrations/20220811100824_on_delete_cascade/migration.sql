/*
  Warnings:

  - You are about to drop the `Holiday` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `HolidayApproval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `HolidayPerUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Holiday" DROP CONSTRAINT "Holiday_holidayPerUserId_fkey";

-- DropForeignKey
ALTER TABLE "HolidayApproval" DROP CONSTRAINT "HolidayApproval_holidayId_fkey";

-- DropForeignKey
ALTER TABLE "HolidayPerUser" DROP CONSTRAINT "HolidayPerUser_userId_fkey";

-- AlterTable
ALTER TABLE "HolidayApproval" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "HolidayPerUser" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Holiday";

-- CreateTable
CREATE TABLE "holidays" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "holidayPerUserId" INTEGER,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_holidayPerUserId_fkey" FOREIGN KEY ("holidayPerUserId") REFERENCES "HolidayPerUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HolidayPerUser" ADD CONSTRAINT "HolidayPerUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HolidayApproval" ADD CONSTRAINT "HolidayApproval_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holidays"("id") ON DELETE CASCADE ON UPDATE CASCADE;
