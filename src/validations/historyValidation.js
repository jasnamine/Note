const Joi = require("joi");

const getNoteHistorySchema = {
  params: Joi.object({
    noteId: Joi.number().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = { getNoteHistorySchema };
