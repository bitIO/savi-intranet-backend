import { registerDecorator, ValidationOptions } from 'class-validator';
import { ValidRoleRule } from '../validator';

export function ValidRole(validationOptions?: ValidationOptions) {
  function decorate(object: any, propertyName: string) {
    registerDecorator({
      name: 'ValidRole',
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: ValidRoleRule,
    });
  }

  return decorate;
}
