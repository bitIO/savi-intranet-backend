import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'ValidRole',
})
@Injectable()
class ValidRoleRule implements ValidatorConstraintInterface {
  validate(roles: Role[]) {
    const requestedValues = Object.values(roles);
    const uniqueValues = [...new Set(requestedValues)];
    if (requestedValues.length !== uniqueValues.length) {
      return false;
    }
    const validValues = Object.values(Role);

    let containsInvalid = false;
    roles.forEach((role) => {
      if (validValues.indexOf(role) === -1) {
        containsInvalid = true;
      }
    });

    return !containsInvalid;
  }

  defaultMessage(): string {
    return 'Invalid role(s)';
  }
}

export { ValidRoleRule };
