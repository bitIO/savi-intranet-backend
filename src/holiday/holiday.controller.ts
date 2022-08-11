import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CommentHolidayRequestDto, CreateHolidayDto } from './dto';
import { HolidayService } from './holiday.service';

@UseGuards(JwtGuard)
@Controller('holidays')
export class HolidayController {
  constructor(private holidayService: HolidayService) {}

  @Get()
  getHolidays() {
    return this.holidayService.getHolidays();
  }

  @Get('user/:id')
  getHolidaysPerUser(@Param('id', ParseIntPipe) userId: number) {
    return this.holidayService.getHolidays(userId);
  }

  @Post()
  createHolidaysRequest(
    @GetUser('id') userId: number,
    @Body() dto: CreateHolidayDto,
  ) {
    return this.holidayService.createHolidayRequest(userId, dto);
  }

  @Post(':id/comments')
  commentHolidayRequest(@Body() dto: CommentHolidayRequestDto) {
    return this.holidayService.commentHolidayRequest(
      dto.userId,
      dto.holidayRequestId,
      dto.comment,
    );
  }

  @Patch(':id/status')
  updateStateHolidayRequest() {
    throw new Error('Not implemented');
  }
}
