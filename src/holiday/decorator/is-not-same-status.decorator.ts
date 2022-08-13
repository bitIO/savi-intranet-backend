import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsNotSameStatusRule } from '../validator';

export function IsNotSameStatus(validationOptions?: ValidationOptions) {
  function decorate(object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNotSameStatus',
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: IsNotSameStatusRule,
    });
  }

  return decorate;
}
