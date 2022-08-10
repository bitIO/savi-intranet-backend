import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HolidayModule } from './holiday/holiday.module';

@Module({
  imports: [AuthModule, UserModule, HolidayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
