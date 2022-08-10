import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { HolidayModule } from './holiday/holiday.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  controllers: [AuthController],
  imports: [AuthModule, UserModule, HolidayModule, PrismaModule],
  providers: [AuthService],
})
export class AppModule {}
