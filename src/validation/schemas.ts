import * as Joi from 'joi';

export const passwordSchema = Joi.string().required().min(8).max(64);
export const usernameSchema = Joi.string().required().min(8).max(64);
