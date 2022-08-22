import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpsertUserHolidaysDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @Type(() => {
    return Date;
  })
  @IsDate()
  @IsOptional()
  date?: Date;
}
