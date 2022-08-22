import { Module } from '@nestjs/common';
import { UserHolidaysController } from './user-holidays.controller';
import { UserHolidaysService } from './user-holidays.service';

@Module({
  controllers: [UserHolidaysController],
  exports: [UserHolidaysService],
  providers: [UserHolidaysService],
})
export class UserHolidaysModule {}
