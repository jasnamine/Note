const Joi = require("joi");

const uploadImageNoteSchema = Joi.object({
  params: Joi.object({
    noteId: Joi.number().required(),
  }),
  body: Joi.object({}).unknown(true),
  files: Joi.array().min(1).items(Joi.object().unknown(true)).required(),
  user: Joi.object({
    id: Joi.number().required(),
  }),
});

const deleteImageNoteSchema = Joi.object({
  params: Joi.object({
    noteId: Joi.number().required(),
  }),
  body: Joi.object({
    imageUrl: Joi.string().uri().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
});

module.exports = {
  uploadImageNoteSchema,
  deleteImageNoteSchema,
};
