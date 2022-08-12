import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ValidRole } from '../decorator';

export class EditUserDto {
  @ApiProperty({
    example: 'savi@savispain.es',
    type: 'String',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    enum: Role,
  })
  @ValidRole()
  @IsOptional()
  role?: Role[];
}
