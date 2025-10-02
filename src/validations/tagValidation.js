const Joi = require("joi");

const getTagsSchema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const createTagSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(1).required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const updateTagSchema = {
  params: Joi.object({
    tagId: Joi.number().integer().positive().required(),
  }),
  body: Joi.object({
    tagName: Joi.string().trim().min(1).required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const deleteTagSchema = {
  params: Joi.object({
    tagId: Joi.number().integer().positive().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = { createTagSchema, getTagsSchema, updateTagSchema, deleteTagSchema };
