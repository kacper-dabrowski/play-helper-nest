import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import Joi, { ObjectSchema } from 'joi';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema, private type: string) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== this.type) {
      return value;
    }

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

export const bodyValidationPipe = (schema: ObjectSchema) =>
  new ValidationPipe(schema, 'body');

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
