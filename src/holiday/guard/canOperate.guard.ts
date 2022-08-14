import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';
import { HolidayService } from '../holiday.service';

@Injectable()
export class CanOperateGuard implements CanActivate {
  constructor(
    private holidayService: HolidayService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { params, user }: { body: any; params: any; user: User } = req;

    if (!params.holidayRequestId) {
      return true;
    }

    let holidayRequestId = 0;
    try {
      holidayRequestId = parseInt(params.holidayRequestId, 10);
    } catch (error) {
      return false;
    }

    if (!user) {
      return false;
    }

    const holidayRequest = await this.holidayService.getHolidayRequestById(
      holidayRequestId,
    );
    if (!holidayRequest) {
      return false;
    }
    if (holidayRequest.requestorId === user.id) {
      return true;
    }

    const requireRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requireRoles) {
      return false;
    }

    return !!requireRoles.find((role) => {
      return user.role.includes(Role[role]);
    });
  }
}
