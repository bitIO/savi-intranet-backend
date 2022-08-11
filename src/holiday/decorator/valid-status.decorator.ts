import { registerDecorator, ValidationOptions } from 'class-validator';
import { ValidStatusRule } from '../validator';

export function ValidStatus(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ValidStatus',
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: ValidStatusRule,
    });
  };
}
