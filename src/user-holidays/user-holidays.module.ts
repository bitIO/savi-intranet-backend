import { Module } from '@nestjs/common';
import { UserHolidaysController } from './user-holidays.controller';
import { UserHolidaysService } from './user-holidays.service';

@Module({
  controllers: [UserHolidaysController],
  providers: [UserHolidaysService],
})
export class UserModule {}
