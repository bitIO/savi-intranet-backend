import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ValidRoleRule } from './validator';

@Module({
  controllers: [UserController],
  providers: [UserService, ValidRoleRule],
})
export class UserModule {}
