import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HolidayService } from '../holiday.service';
import { IUpdateHolidayRequestStatusDto } from '../types';

@ValidatorConstraint({
  async: true,
  name: 'IsNotSameStatus',
})
@Injectable()
class IsNotSameStatusRule implements ValidatorConstraintInterface {
  constructor(private holidayService: HolidayService) {}

  async validate(status: Status, validationArguments?: ValidationArguments) {
    const dto = validationArguments.object as IUpdateHolidayRequestStatusDto;
    const holidayRequest = await this.holidayService.getHolidayRequestById(
      dto.holidayRequestId,
    );

    return !(holidayRequest.status === status);
  }

  defaultMessage(): string {
    return 'Requested status is not different';
  }
}

export { IsNotSameStatusRule };
