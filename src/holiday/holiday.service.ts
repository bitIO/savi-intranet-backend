import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role, Status, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { countBusinessDays } from '../utils';
import { CreateHolidayDto } from './dto';

@Injectable()
export class HolidayService {
  constructor(private prisma: PrismaService) {}

  async createHolidayRequest(userId: number, dto: CreateHolidayDto) {
    try {
      const data = await this.prisma.holidayRequests.create({
        data: {
          description: dto.description,
          end: dto.end,
          requestedDays: countBusinessDays(dto.start, dto.end),
          requestorId: userId,
          start: dto.start,
        },
        select: {
          createdAt: true,
          description: true,
          end: true,
          id: true,
          requestedDays: true,
          requestorId: true,
          start: true,
          status: true,
        },
      });

      return data;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Request already created.');
        }
      }
      throw error;
    }
  }

  async getHolidayRequestById(id: number) {
    return this.prisma.holidayRequests.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async getHolidaysRequests(loggedUserId: number, userId?: number) {
    let loggedUse: User;
    if (!userId || userId !== loggedUserId) {
      loggedUse = await this.prisma.user.findFirst({
        where: {
          id: loggedUserId,
        },
      });
      if (!loggedUse.role.includes(Role.APPROVE)) {
        throw new ForbiddenException('Access to resource denied');
      }
    }

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
        description: true,
        end: true,
        id: true,
        requestedDays: true,
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
    holidayRequestId: number,
    validatorId: number,
    comment: string,
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

  async isValidRequest(userId: number, dto: CreateHolidayDto) {
    const userHolidays = await this.prisma.userHolidays.findUniqueOrThrow({
      where: {
        userId_year: {
          userId,
          year: dto.start.getFullYear(),
        },
      },
    });
    const requestedDays = countBusinessDays(dto.start, dto.end);
    if (requestedDays <= 0) {
      return new BadRequestException('Requested days count is invalid');
    }
    if (requestedDays > userHolidays.remaining) {
      return new ConflictException('Quota exceeded');
    }

    return null;
  }
}
