import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsNotSameStatusRule } from '../validator';

export function IsNotSameStatus(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNotSameStatus',
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: IsNotSameStatusRule,
    });
  };
}
