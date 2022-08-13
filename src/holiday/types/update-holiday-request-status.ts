import { Status } from '@prisma/client';

export interface IUpdateHolidayRequestStatusDto {
  comment?: string;
  holidayRequestId: number;
  status: Status;
  validatorId: number;
}
