import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, MinLength } from 'class-validator';

export class CommentHolidayRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  holidayRequestId: number;

  @IsNotEmpty()
  @MinLength(2)
  comment: string;
}
