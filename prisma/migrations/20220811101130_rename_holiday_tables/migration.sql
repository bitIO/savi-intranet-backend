/*
  Warnings:

  - You are about to drop the `HolidayApproval` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HolidayPerUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HolidayApproval" DROP CONSTRAINT "HolidayApproval_holidayId_fkey";

-- DropForeignKey
ALTER TABLE "HolidayApproval" DROP CONSTRAINT "HolidayApproval_userId_fkey";

-- DropForeignKey
ALTER TABLE "HolidayPerUser" DROP CONSTRAINT "HolidayPerUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "holidays" DROP CONSTRAINT "holidays_holidayPerUserId_fkey";

-- DropTable
DROP TABLE "HolidayApproval";

-- DropTable
DROP TABLE "HolidayPerUser";

-- CreateTable
CREATE TABLE "holidays_per_user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "holidays_per_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays_approval" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "holidayId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "holidays_approval_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_holidayPerUserId_fkey" FOREIGN KEY ("holidayPerUserId") REFERENCES "holidays_per_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays_per_user" ADD CONSTRAINT "holidays_per_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays_approval" ADD CONSTRAINT "holidays_approval_holidayId_fkey" FOREIGN KEY ("holidayId") REFERENCES "holidays"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays_approval" ADD CONSTRAINT "holidays_approval_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
