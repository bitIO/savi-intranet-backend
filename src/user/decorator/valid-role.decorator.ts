import { registerDecorator, ValidationOptions } from 'class-validator';
import { ValidRoleRule } from '../validator';

export function ValidRole(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ValidRole',
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: ValidRoleRule,
    });
  };
}
