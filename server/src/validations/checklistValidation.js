const Joi = require("joi");

const addChecklistItemSchema = Joi.object({
  title: Joi.string().required(),
  isDone: Joi.boolean().default(false),
  order: Joi.number().default(0),
});

const updateChecklistItemSchema = Joi.object({
  title: Joi.string().optional(),
  isDone: Joi.boolean().optional(),
  order: Joi.number().optional(),
});

module.exports = { addChecklistItemSchema, updateChecklistItemSchema };
