import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import Joi, { ObjectSchema } from 'joi';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: unknown) {
    const { error } = this.schema.validate(value, { abortEarly: false });

    if (error) {
      throw new BadRequestException(this.mapDetailsToMessage(error));
    }

    return value;
  }

  private mapDetailsToMessage(error: Joi.ValidationError) {
    return error.details.map(({ message, path }) => ({ message, path }));
  }
}

export const createSchemaValidator =
  (schema: ObjectSchema) => (value: unknown) => {
    try {
      const { error } = schema.validate(value);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      return false;
    }
  };
