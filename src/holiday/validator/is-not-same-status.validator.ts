import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UpdateHolidayRequestStatusDto } from '../dto/update-holiday-request-status.dto';
import { HolidayService } from '../holiday.service';

@ValidatorConstraint({
  async: true,
  name: 'IsNotSameStatus',
})
@Injectable()
class IsNotSameStatusRule implements ValidatorConstraintInterface {
  constructor(private holidayService: HolidayService) {}

  async validate(status: Status, validationArguments?: ValidationArguments) {
    const dto = validationArguments.object as UpdateHolidayRequestStatusDto;
    const holidayRequest = await this.holidayService.getHolidayRequestById(
      dto.holidayRequestId,
    );
    return !(holidayRequest.status === status);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Requested status is not different';
  }
}

export { IsNotSameStatusRule };
