import * as Joi from 'joi';

const supportRequestString = Joi.string().max(64).min(1);

export const createSupportRequestSchema = Joi.object({
  title: supportRequestString.required(),
  description: supportRequestString.required(),
  content: supportRequestString.required(),
  department: supportRequestString.required(),
});

export const updateSupportRequestSchema = Joi.object({
  title: supportRequestString.optional(),
  description: supportRequestString.optional(),
  content: supportRequestString.optional(),
  department: supportRequestString.optional(),
});
