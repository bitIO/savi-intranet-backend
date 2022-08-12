import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { IsNotSameStatus, IsValidRequest, ValidStatus } from '../decorator';

export class UpdateHolidayRequestStatusDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  validatorId: number;

  @ApiProperty()
  @IsValidRequest()
  holidayRequestId: number;

  @ApiProperty()
  @IsNotSameStatus()
  @ValidStatus()
  status: Status;

  @ApiProperty()
  @IsOptional()
  comment?: string;
}
