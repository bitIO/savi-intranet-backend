import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HolidayModule } from './holiday/holiday.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, HolidayModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
