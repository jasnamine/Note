const Joi = require("joi");

const editUserSchema = {
  body: Joi.object({
    fullname: Joi.string().trim().min(1).optional(),
    avatar: Joi.string().uri().optional(),
  }),
};

const updateUserSettingsSchema = {
  body: Joi.object({
    language: Joi.string().valid("en", "vi").optional(),
    theme: Joi.string().valid("light", "dark").optional(),
  }).min(1),
};

const getUserSChema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = { editUserSchema, updateUserSettingsSchema, getUserSChema };
