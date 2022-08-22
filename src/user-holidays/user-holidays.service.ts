import { Injectable } from '@nestjs/common';
import { calculateRemainingDays } from '../holiday/utils';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertUserHolidaysDto } from './dto/upsert-user-holidays.dto';

@Injectable()
export class UserHolidaysService {
  constructor(private prisma: PrismaService) {}

  upsert(dto: UpsertUserHolidaysDto) {
    return this.prisma.userHolidays.upsert({
      create: {
        remaining: calculateRemainingDays(),
        userId: dto.userId,
        year: (dto.date || new Date()).getFullYear(),
      },
      update: {
        remaining: calculateRemainingDays(),
        userId: dto.userId,
        year: (dto.date || new Date()).getFullYear(),
      },
      where: {
        userId_year: {
          userId: dto.userId,
          year: (dto.date || new Date()).getFullYear(),
        },
      },
    });
  }
}
