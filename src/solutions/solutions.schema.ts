import * as Joi from 'joi';

const supportRequestString = Joi.string().max(64).min(1);

export const createSolutionSchema = Joi.object({
  title: supportRequestString.required(),
  description: supportRequestString.required(),
  content: supportRequestString.required(),
  isPublic: Joi.boolean().optional(),
});

export const updateSolutionSchema = Joi.object({
  title: supportRequestString.optional(),
  description: supportRequestString.optional(),
  content: supportRequestString.optional(),
  isPublic: Joi.boolean().optional(),
});
