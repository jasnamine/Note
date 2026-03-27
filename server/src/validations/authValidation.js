const Joi = require("joi");
const registerSchema = {
  body: Joi.object({
    username: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).required(),
    fullname: Joi.string().trim().min(1).required(),
  }),
};

const loginSchema = {
  body: Joi.object({
    username: Joi.string().trim().optional(),
    email: Joi.string().trim().email().optional(),
    password: Joi.string().required(),
  }).or("username", "email"),
};

const forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string().trim().email().required(),
  }),
};

const resetPasswordSchema = {
  body: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
