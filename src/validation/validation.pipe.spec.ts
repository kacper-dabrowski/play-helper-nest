import { BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';
import { ValidationPipe } from './validation.pipe';

const personSchema = Joi.object({ name: Joi.string(), surname: Joi.string() });

describe('ValidationPipe', () => {
  let pipeInstance: ValidationPipe;

  beforeEach(() => {
    pipeInstance = new ValidationPipe(personSchema);
  });

  it('should throw validation error with details if schema does not match value', () => {
    try {
      pipeInstance.transform({ not: 'a person' });
    } catch (error) {
      expect(error).toEqual(new BadRequestException('"not" is not allowed'));
    }

    expect.assertions(1);
  });

  it('should return value, when it is valid', async () => {
    expect(pipeInstance.transform({ name: 'john', surname: 'doe' })).toEqual({
      name: 'john',
      surname: 'doe',
    });
  });
});
