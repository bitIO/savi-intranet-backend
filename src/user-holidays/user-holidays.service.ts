import { Injectable } from '@nestjs/common';
import { calculateRemainingDays } from '../holiday/utils';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertUserHolidaysDto } from './dto';

@Injectable()
export class UserHolidaysService {
  constructor(private prisma: PrismaService) {}

  getByUser(userId: number) {
    return this.prisma.userHolidays.findMany({
      where: {
        userId,
      },
    });
  }

  getByUserYear(userId: number, year: number) {
    return this.prisma.userHolidays.findUnique({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
    });
  }

  create(dto: UpsertUserHolidaysDto) {
    return this.prisma.userHolidays.create({
      data: {
        remaining: calculateRemainingDays(),
        userId: dto.userId,
        year: dto.year || new Date().getFullYear(),
      },
    });
  }

  update(dto: UpsertUserHolidaysDto) {
    return this.prisma.userHolidays.update({
      data: {
        remaining: calculateRemainingDays(),
        userId: dto.userId,
        year: dto.year || new Date().getFullYear(),
      },
      where: {
        userId_year: {
          userId: dto.userId,
          year: dto.year || new Date().getFullYear(),
        },
      },
    });
  }
}
