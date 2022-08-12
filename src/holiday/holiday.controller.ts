import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { GetUser, Roles } from '../auth/decorator';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { CommentHolidayRequestDto, CreateHolidayDto } from './dto';
import { UpdateHolidayRequestStatusDto } from './dto/update-holiday-request-status.dto';
import { HolidayService } from './holiday.service';

@ApiTags('holiday')
@UseGuards(JwtGuard)
@Controller('holidays')
export class HolidayController {
  constructor(private holidayService: HolidayService) {}

  @Get()
  @Roles(Role.APPROVE)
  @UseGuards(RolesGuard)
  getHolidays(@GetUser('id') loggedUserId: number) {
    return this.holidayService.getHolidaysRequests(loggedUserId);
  }

  @Get('users/:id')
  getHolidaysPerUser(
    @GetUser('id') loggedUserId: number,
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.holidayService.getHolidaysRequests(loggedUserId, userId);
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

  @Post(':id/validations')
  @Roles(Role.APPROVE)
  @UseGuards(RolesGuard)
  updateHolidayRequestStatus(@Body() dto: UpdateHolidayRequestStatusDto) {
    return this.holidayService.updateHolidayRequestStatus(
      dto.validatorId,
      dto.comment,
      dto.holidayRequestId,
      dto.status,
    );
  }
}
