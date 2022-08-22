import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtAccessGuard } from '../auth/guard';
import { UserHolidaysService } from './user-holidays.service';

@ApiBearerAuth()
@ApiTags('user-holidays')
@UseGuards(JwtAccessGuard)
@Controller('users-holidays')
export class UserHolidaysController {
  constructor(private userHolidaysService: UserHolidaysService) {}

  @Get(':year')
  getUserHolidaysByYear(
    @GetUser() user: User,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.userHolidaysService.getByUserYear(user.id, year);
  }

  @Get()
  getUserHoliday(@GetUser() user: User) {
    return this.userHolidaysService.getByUser(user.id);
  }

  @Post(':userId/:year')
  createRecordForUserTear(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.userHolidaysService.create({
      userId,
      year,
    });
  }

  @Patch(':userId/:year')
  updateRecordForUserTear(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.userHolidaysService.update({
      userId,
      year,
    });
  }
}
