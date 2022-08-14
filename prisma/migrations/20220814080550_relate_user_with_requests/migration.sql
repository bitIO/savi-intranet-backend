-- AddForeignKey
ALTER TABLE "holiday_requests" ADD CONSTRAINT "holiday_requests_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
