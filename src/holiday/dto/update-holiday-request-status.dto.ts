import { Status } from '@prisma/client';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { IsNotSameStatus, ValidStatus } from '../decorator';

export class UpdateHolidayRequestStatusDto {
  @IsNumber()
  @IsPositive()
  // @IsValidValidator() TODO: user exist and role is valid
  validatorId: number;

  @IsNumber()
  @IsPositive()
  // @IsValidRequest() TODO: request exists
  holidayRequestId: number;

  @IsNotSameStatus()
  @ValidStatus()
  status: Status;

  @IsOptional()
  comment?: string;
}
