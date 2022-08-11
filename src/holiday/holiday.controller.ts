import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateHolidayDto } from './dto';
import { HolidayService } from './holiday.service';

@UseGuards(JwtGuard)
@Controller('holidays')
export class HolidayController {
  constructor(private holidayService: HolidayService) {}

  @Get()
  getHolidays() {
    return this.holidayService.getHolidays();
  }

  @Get('user')
  getHolidaysPerUser(@Param('id') userId: number) {
    return null;
  }

  @Post()
  createHolidays(@GetUser('id') userId: number, @Body() dto: CreateHolidayDto) {
    return this.holidayService.createHoliday(userId, dto);
  }
}
