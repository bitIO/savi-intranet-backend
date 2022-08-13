import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsValidRequestRule } from '../validator';

export function IsValidRequest(validationOptions?: ValidationOptions) {
  function decorate(object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidRequest',
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: IsValidRequestRule,
    });
  }

  return decorate;
}
