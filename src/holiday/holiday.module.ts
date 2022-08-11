import { Module } from '@nestjs/common';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import {
  IsNotSameStatusRule,
  IsValidRequestRule,
  ValidStatusRule,
} from './validator';

@Module({
  controllers: [HolidayController],
  providers: [
    HolidayService,
    ValidStatusRule,
    IsNotSameStatusRule,
    IsValidRequestRule,
  ],
})
export class HolidayModule {}
