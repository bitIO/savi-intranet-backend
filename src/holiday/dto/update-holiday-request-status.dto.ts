import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { IsNotSameStatus, IsValidRequest, ValidStatus } from '../decorator';
import { IUpdateHolidayRequestStatusDto } from '../types';

export class UpdateHolidayRequestStatusDto
  implements IUpdateHolidayRequestStatusDto
{
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
