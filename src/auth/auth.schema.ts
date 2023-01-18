import * as Joi from 'joi';
import { passwordSchema, usernameSchema } from '../validation/schemas';

export const loginSchema = Joi.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const registrationSchema = Joi.object({
  username: usernameSchema,
  password: passwordSchema,
  fullName: Joi.string().required().min(8).max(32),
  startingPage: Joi.string(),
});
