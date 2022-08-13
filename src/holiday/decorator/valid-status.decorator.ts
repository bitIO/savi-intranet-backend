import { registerDecorator, ValidationOptions } from 'class-validator';
import { ValidStatusRule } from '../validator';

export function ValidStatus(validationOptions?: ValidationOptions) {
  function decorate(object: any, propertyName: string) {
    registerDecorator({
      name: 'ValidStatus',
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: ValidStatusRule,
    });
  }

  return decorate;
}
