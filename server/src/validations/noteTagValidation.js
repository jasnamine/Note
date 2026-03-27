const Joi = require("joi");

const addTagToNoteSchema = {
  body: Joi.object({
    noteId: Joi.number().required(),
    tagId: Joi.number().required(),
  })
};

const addMultipleTagsSchema = {
  body: Joi.object({
    noteId: Joi.number().required(),
    tagIDs: Joi.array().items().min(1).required(),
  })
};

const getTagsOfNoteSchema = {
  params: Joi.object({
    noteId: Joi.number().required(),
  }),
};

const removeTagNoteSchema = {
  body: Joi.object({
    noteId: Joi.number().required(),
    tagId: Joi.number().required(),
  })
};


module.exports = {
  addTagToNoteSchema,
  addMultipleTagsSchema,
  removeTagNoteSchema,
  getTagsOfNoteSchema,
};
