import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { GetUser, Roles } from '../auth/decorator';
import { JwtAccessGuard, RolesGuard } from '../auth/guard';
import {
  CommentHolidayRequestDto,
  CreateHolidayDto,
  UpdateHolidayRequestStatusDto,
} from './dto';
import { CanOperateGuard, HolidaysQuotaGuard } from './guard';
import { HolidayService } from './holiday.service';

@ApiTags('holiday')
@UseGuards(JwtAccessGuard)
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

  @UseGuards(HolidaysQuotaGuard)
  @Post()
  createHolidaysRequest(
    @GetUser('id') userId: number,
    @Body() dto: CreateHolidayDto,
  ) {
    return this.holidayService.createHolidayRequest(userId, dto);
  }

  @Post(':holidayRequestId/comments')
  commentHolidayRequest(
    @Param('holidayRequestId', ParseIntPipe) holidayRequestId: number,
    @Body() dto: CommentHolidayRequestDto,
  ) {
    return this.holidayService.commentHolidayRequest(
      dto.userId,
      holidayRequestId,
      dto.comment,
    );
  }

  @Post(':holidayRequestId/validations')
  @Roles(Role.APPROVE)
  @UseGuards(RolesGuard)
  updateHolidayRequestStatus(
    @Param('holidayRequestId', ParseIntPipe) holidayRequestId: number,
    @Body() dto: UpdateHolidayRequestStatusDto,
  ) {
    return this.holidayService.updateHolidayRequestStatus(
      holidayRequestId,
      dto.validatorId,
      dto.comment,
      dto.status,
    );
  }

  @Roles(Role.APPROVE, Role.ADMIN)
  @UseGuards(CanOperateGuard)
  @Delete(':holidayRequestId')
  removeHolidaysRequest(
    @Param('holidayRequestId', ParseIntPipe) holidayRequestId: number,
  ) {
    this.holidayService.deleteHolidayRequest(holidayRequestId);
  }
}
