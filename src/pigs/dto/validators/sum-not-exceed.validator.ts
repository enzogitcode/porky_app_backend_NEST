import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function SumNotExceed(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'sumNotExceed',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (value == null || relatedValue == null) return true; // si alguno no está, no validamos
          return value + relatedValue <= 10; // o el máximo que quieras
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} + ${relatedPropertyName} no puede superar el máximo permitido`;
        },
      },
    });
  };
}
