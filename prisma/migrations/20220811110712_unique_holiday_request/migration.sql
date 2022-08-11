/*
  Warnings:

  - A unique constraint covering the columns `[userId,start,end]` on the table `holidays` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "holidays_userId_start_end_key" ON "holidays"("userId", "start", "end");
