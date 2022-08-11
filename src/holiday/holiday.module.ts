import { Module } from '@nestjs/common';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { IsNotSameStatusRule, ValidStatusRule } from './validator';

@Module({
  controllers: [HolidayController],
  providers: [HolidayService, ValidStatusRule, IsNotSameStatusRule],
})
export class HolidayModule {}
