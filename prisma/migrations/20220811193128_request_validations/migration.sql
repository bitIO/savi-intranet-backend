-- CreateTable
CREATE TABLE "holiday_requests_validations" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,
    "holidayRequestId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'REJECTED',
    "validatorId" INTEGER NOT NULL,

    CONSTRAINT "holiday_requests_validations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "holiday_requests_validations" ADD CONSTRAINT "holiday_requests_validations_holidayRequestId_fkey" FOREIGN KEY ("holidayRequestId") REFERENCES "holiday_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holiday_requests_validations" ADD CONSTRAINT "holiday_requests_validations_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
