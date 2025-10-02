const Joi = require("joi");

const deleteNotificationSchema = {
  params: Joi.object({
    notificationId: Joi.number().integer().positive().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const getNotificationsSchema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const markAllNotificationsAsReadSchema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = {
  deleteNotificationSchema,
  getNotificationsSchema,
  markAllNotificationsAsReadSchema,
};
