import { IsNotEmpty, IsNumber, IsPositive, MinLength } from 'class-validator';

export class CommentHolidayRequestDto {
  @IsNumber()
  @IsPositive()
  userId: number;

  @IsNumber()
  @IsPositive()
  holidayRequestId: number;

  @IsNotEmpty()
  @MinLength(2)
  comment: string;
}
