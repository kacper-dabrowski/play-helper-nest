import * as Joi from 'joi';
import {
  bodyValidationPipe,
  createSchemaValidator,
  ValidationPipe,
} from './validation.pipe';

const personSchema = Joi.object({ name: Joi.string(), surname: Joi.string() });

describe('ValidationPipe', () => {
  const validPerson = { name: 'john', surname: 'doe' };
  const invalidPerson = { not: 'a person' };

  let pipeInstance: ValidationPipe;

  beforeEach(() => {
    pipeInstance = bodyValidationPipe(personSchema);
  });

  it('should throw validation error with details if schema does not match value', () => {
    try {
      pipeInstance.transform(invalidPerson, { type: 'body' });
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
    expect(pipeInstance.transform(validPerson, { type: 'body' })).toEqual(
      validPerson,
    );
  });

  it('should return boolean indicating if schema is valid', async () => {
    const validator = createSchemaValidator(personSchema);

    expect(validator(invalidPerson)).toEqual(false);
    expect(validator(validPerson)).toEqual(true);
  });

  it('should not validate, when type does not match', async () => {
    const validateSpy = jest.spyOn(personSchema, 'validate');

    expect(pipeInstance.transform(invalidPerson, { type: 'param' })).toEqual(
      invalidPerson,
    );
    expect(validateSpy).not.toHaveBeenCalled();
  });
});
