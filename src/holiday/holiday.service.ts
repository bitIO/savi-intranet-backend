import { ConflictException, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHolidayDto } from './dto';

@Injectable()
export class HolidayService {
  constructor(private prisma: PrismaService) {}

  async createHolidayRequest(userId: number, dto: CreateHolidayDto) {
    try {
      const data = await this.prisma.holidayRequests.create({
        data: {
          end: dto.end,
          requestorId: userId,
          start: dto.start,
        },
        select: {
          createdAt: true,
          end: true,
          id: true,
          requestorId: true,
          start: true,
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

  async getHolidayRequest(id: number) {
    return this.prisma.holidayRequests.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async getHolidays(userId?: number) {
    const where: any = {};
    if (userId) {
      where.requestorId = {
        equals: userId,
      };
    }
    return this.prisma.holidayRequests.findMany({
      select: {
        HolidayRequestsComments: true,
        HolidayRequestsValidations: true,
        createdAt: true,
        end: true,
        id: true,
        requestorId: true,
        start: true,
        status: true,
        updatedAt: true,
      },
      where,
    });
  }

  async commentHolidayRequest(
    userId: number,
    holidayRequestId: number,
    comment: string,
  ) {
    return this.prisma.holidayRequestsComments.create({
      data: {
        comment,
        holidayRequestId,
        userId,
      },
    });
  }

  async updateHolidayRequestStatus(
    validatorId: number,
    comment: string,
    holidayRequestId: number,
    status: Status,
  ) {
    const validation = await this.prisma.holidayRequestsValidations.create({
      data: {
        comment,
        holidayRequestId,
        status,
        validatorId,
      },
    });
    const holidayRequest = await this.prisma.holidayRequests.update({
      data: {
        status,
      },
      where: {
        id: holidayRequestId,
      },
    });

    return {
      holidayRequest,
      validation,
    };
  }
}
