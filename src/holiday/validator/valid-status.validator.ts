import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'ValidStatus',
})
@Injectable()
class ValidStatusRule implements ValidatorConstraintInterface {
  async validate(status: Status) {
    return Object.values(Status).indexOf(status) !== -1;
  }

  defaultMessage(): string {
    return 'Invalid status';
  }
}

export { ValidStatusRule };
