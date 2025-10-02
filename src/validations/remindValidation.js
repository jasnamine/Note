const Joi = require("joi");

const sendEmailRemindSchema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const createMultipleRemindersSchema = {
  body: Joi.object({
    noteId: Joi.number().required(),
    reminders: Joi.array().items().min(1).required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const createReminderSchema = {
  params: Joi.object({
    noteId: Joi.number().integer().positive().required(),
  }),
  body: Joi.object({
    time: Joi.date().required(),
    repeat: Joi.string().valid("none", "daily", "weekly", "monthly").optional(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const updateReminderSchema = {
  params: Joi.object({
    id: Joi.number().integer().positive().required(),
    noteId: Joi.number().required(),
  }),
  body: Joi.object({
    time: Joi.date().required(),
    repeat: Joi.string().valid("none", "daily", "weekly", "monthly").required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const deleteReminderSchema = {
  params: Joi.object({
    noteId: Joi.number().integer().positive().required(),
    id: Joi.number().integer().positive().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = {
  sendEmailRemindSchema,

  createReminderSchema,
  updateReminderSchema,
  deleteReminderSchema,
  createMultipleRemindersSchema,
};
