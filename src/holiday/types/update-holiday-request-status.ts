import { Status } from '@prisma/client';

export interface IUpdateHolidayRequestStatusDto {
  comment?: string;
  status: Status;
  validatorId: number;
}
