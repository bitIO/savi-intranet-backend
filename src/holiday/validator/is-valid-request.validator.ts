import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HolidayService } from '../holiday.service';

@ValidatorConstraint({
  async: true,
  name: 'IsValidRequest',
})
@Injectable()
class IsValidRequestRule implements ValidatorConstraintInterface {
  constructor(private holidayService: HolidayService) {}

  async validate(holidayRequestId: number) {
    try {
      const holidayRequest = await this.holidayService.getHolidayRequestById(
        holidayRequestId,
      );

      return holidayRequest !== undefined && holidayRequest !== null;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(): string {
    return 'Invalid holiday request id';
  }
}

export { IsValidRequestRule };
