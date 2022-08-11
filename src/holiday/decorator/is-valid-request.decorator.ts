import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsValidRequestRule } from '../validator';

export function IsValidRequest(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidRequest',
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: IsValidRequestRule,
    });
  };
}
