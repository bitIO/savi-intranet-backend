import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { parseISO } from 'date-fns';
import { HolidayService } from '../holiday.service';

@Injectable()
export class HolidaysQuotaGuard implements CanActivate {
  constructor(private holidayService: HolidayService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body, user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    const start = parseISO(body.start);
    const end = parseISO(body.end);
    const error = await this.holidayService.isValidRequest(user.id, {
      description: body.description,
      end,
      start,
    });

    if (error) {
      throw error;
    }

    return true;
  }
}
