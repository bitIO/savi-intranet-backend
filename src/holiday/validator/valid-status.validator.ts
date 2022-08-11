import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'ValidStatus',
})
@Injectable()
class ValidStatusRule implements ValidatorConstraintInterface {
  async validate(status: Status, validationArguments?: ValidationArguments) {
    return Object.values(Status).indexOf(status) !== -1;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Invalid status';
  }
}

export { ValidStatusRule };
