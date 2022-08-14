import { Module } from '@nestjs/common';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { ValidStatusRule } from './validator';

@Module({
  controllers: [HolidayController],
  providers: [HolidayService, ValidStatusRule],
})
export class HolidayModule {}
