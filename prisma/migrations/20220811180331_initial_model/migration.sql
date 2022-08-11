-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'APPROVE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'REJECTED', 'APPROVED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "Role"[] DEFAULT ARRAY['USER']::"Role"[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holiday_requests" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requestorId" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "holiday_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holiday_requests_comments" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comment" TEXT NOT NULL,
    "holidayRequestId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "holiday_requests_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_holidays" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 2022,
    "remaining" INTEGER NOT NULL DEFAULT 22,
    "holidayRequestsId" INTEGER NOT NULL,

    CONSTRAINT "user_holidays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "holiday_requests_requestorId_start_end_key" ON "holiday_requests"("requestorId", "start", "end");

-- CreateIndex
CREATE UNIQUE INDEX "user_holidays_userId_year_key" ON "user_holidays"("userId", "year");

-- AddForeignKey
ALTER TABLE "holiday_requests_comments" ADD CONSTRAINT "holiday_requests_comments_holidayRequestId_fkey" FOREIGN KEY ("holidayRequestId") REFERENCES "holiday_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holiday_requests_comments" ADD CONSTRAINT "holiday_requests_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_holidays" ADD CONSTRAINT "user_holidays_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_holidays" ADD CONSTRAINT "user_holidays_holidayRequestsId_fkey" FOREIGN KEY ("holidayRequestsId") REFERENCES "holiday_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
