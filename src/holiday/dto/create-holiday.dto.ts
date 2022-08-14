import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class CreateHolidayDto {
  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Type(() => {
    return Date;
  })
  @IsDate()
  start: Date;

  @ApiProperty()
  @Type(() => {
    return Date;
  })
  @IsDate()
  end: Date;
}
