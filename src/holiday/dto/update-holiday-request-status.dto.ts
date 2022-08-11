import { Status } from '@prisma/client';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { IsNotSameStatus, IsValidRequest, ValidStatus } from '../decorator';

export class UpdateHolidayRequestStatusDto {
  @IsNumber()
  @IsPositive()
  // @IsValidValidator() TODO: user exist and role is valid
  validatorId: number;

  @IsValidRequest()
  holidayRequestId: number;

  @IsNotSameStatus()
  @ValidStatus()
  status: Status;

  @IsOptional()
  comment?: string;
}
