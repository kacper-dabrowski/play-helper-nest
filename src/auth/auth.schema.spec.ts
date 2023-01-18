import { createSchemaValidator } from '../validation/validation.pipe';
import { loginSchema, registrationSchema } from './auth.schema';

describe('auth schema', () => {
  const validUsernameAndPassword = {
    username: 'jdoe12345',
    password: 'Test12345!',
  };

  describe('login schema', () => {
    const validateLoginSchema = createSchemaValidator(loginSchema);

    it('should return true if all values are correct', () => {
      expect(validateLoginSchema(validUsernameAndPassword)).toEqual(true);
    });

    requiredStringsCases().forEach(({ value, description }) => {
      it(`should return false, when password value ${description}`, () => {
        expect(
          validateLoginSchema({ password: value, ...validUsernameAndPassword }),
        ).toEqual(true);
      });

      it(`should return false, when username value ${description}`, () => {
        expect(
          validateLoginSchema({
            ...validUsernameAndPassword,
            username: value,
          }),
        ).toEqual(false);
      });
    });
  });

  describe('registration schema', () => {
    const validBody = {
      ...validUsernameAndPassword,
      fullName: 'John Doe',
      startingPage: 'any-page',
    };

    const validateRegistrationSchema =
      createSchemaValidator(registrationSchema);

    it('should return true for valid body', () => {
      expect(validateRegistrationSchema(validBody)).toEqual(true);
    });

    requiredStringsCases().forEach(({ value, description }) => {
      it(`should return false, when password value ${description}`, () => {
        expect(
          validateRegistrationSchema({
            ...validBody,
            password: value,
          }),
        ).toEqual(false);
      });

      it(`should return false, when username value ${description}`, () => {
        expect(
          validateRegistrationSchema({
            ...validBody,
            username: value,
          }),
        ).toEqual(false);
      });

      it(`should return false, when fullName value ${description}`, () => {
        expect(
          validateRegistrationSchema({
            ...validBody,
            fullName: value,
          }),
        ).toEqual(false);
      });
    });
  });
});

function requiredStringsCases() {
  return [
    {
      value: '123',
      description: 'too short',
    },
    {
      value:
        'orem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ut nisi a metus varius convallis.',
      description: 'too long',
    },
    {
      value: undefined,
      description: 'not there',
    },
  ];
}
