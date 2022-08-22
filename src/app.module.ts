import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HolidayModule } from './holiday/holiday.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserHolidaysModule } from './user-holidays/user-holidays.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HolidayModule,
    PrismaModule,
    UserHolidaysModule,
    UserModule,
  ],
})
export class AppModule {}
