import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateHolidayDto {
  @Type(() => {
    return Date;
  })
  @IsDate()
  start: Date;

  @Type(() => {
    return Date;
  })
  @IsDate()
  end: Date;
}
