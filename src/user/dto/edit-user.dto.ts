import { Role } from '@prisma/client';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ValidRole } from '../decorator';

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @ValidRole()
  @IsOptional()
  role?: Role[];
}
