-- DropForeignKey
ALTER TABLE "holiday_requests_comments" DROP CONSTRAINT "holiday_requests_comments_holidayRequestId_fkey";

-- DropForeignKey
ALTER TABLE "holiday_requests_comments" DROP CONSTRAINT "holiday_requests_comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "holiday_requests_validations" DROP CONSTRAINT "holiday_requests_validations_holidayRequestId_fkey";

-- DropForeignKey
ALTER TABLE "holiday_requests_validations" DROP CONSTRAINT "holiday_requests_validations_validatorId_fkey";

-- AddForeignKey
ALTER TABLE "holiday_requests_comments" ADD CONSTRAINT "holiday_requests_comments_holidayRequestId_fkey" FOREIGN KEY ("holidayRequestId") REFERENCES "holiday_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holiday_requests_comments" ADD CONSTRAINT "holiday_requests_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holiday_requests_validations" ADD CONSTRAINT "holiday_requests_validations_holidayRequestId_fkey" FOREIGN KEY ("holidayRequestId") REFERENCES "holiday_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holiday_requests_validations" ADD CONSTRAINT "holiday_requests_validations_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
