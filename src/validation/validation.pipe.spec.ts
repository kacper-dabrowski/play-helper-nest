import * as Joi from 'joi';
import { createSchemaValidator, ValidationPipe } from './validation.pipe';

const personSchema = Joi.object({ name: Joi.string(), surname: Joi.string() });

describe('ValidationPipe', () => {
  const validPerson = { name: 'john', surname: 'doe' };
  const invalidPerson = { not: 'a person' };

  let pipeInstance: ValidationPipe;

  beforeEach(() => {
    pipeInstance = new ValidationPipe(personSchema);
  });

  it('should throw validation error with details if schema does not match value', () => {
    try {
      pipeInstance.transform(invalidPerson);
    } catch (error) {
      expect(error.response).toEqual({
        error: 'Bad Request',
        message: [{ message: '"not" is not allowed', path: ['not'] }],
        statusCode: 400,
      });
    }

    expect.assertions(1);
  });

  it('should return value, when it is valid', async () => {
    expect(pipeInstance.transform(validPerson)).toEqual(validPerson);
  });

  it('should return boolean indicating if schema is valid', async () => {
    const validator = createSchemaValidator(personSchema);

    expect(validator(invalidPerson)).toEqual(false);
    expect(validator(validPerson)).toEqual(true);
  });
});
