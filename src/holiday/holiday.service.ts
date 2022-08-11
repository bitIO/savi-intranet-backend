import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHolidayDto } from './dto';

@Injectable()
export class HolidayService {
  constructor(private prisma: PrismaService) {}

  async createHoliday(userId: number, dto: CreateHolidayDto) {
    try {
      const data = await this.prisma.holiday.create({
        data: {
          end: dto.end,
          start: dto.start,
          userId,
        },
        select: {
          createdAt: true,
          end: true,
          id: true,
          start: true,
          userId: true,
        },
      });

      return data;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Request already created.');
        }
        throw error;
      }
    }
  }

  async getHolidays() {
    return this.prisma.holiday.findMany({
      select: {
        createdAt: true,
        end: true,
        id: true,
        start: true,
        updatedAt: true,
        userId: true,
      },
    });
  }
}
