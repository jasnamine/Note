const Joi = require("joi");

const validColors = [
  "Default",
  "Coral",
  "Peach",
  "Sand",
  "Mint",
  "Sage",
  "Fog",
  "Storm",
  "Dusk",
  "Blossom",
  "Clay",
];

const validThemes = [
  "Default",
  "Food",
  "Grocery",
  "Music",
  "Note",
  "Place",
  "Recipe",
  "Travel",
  "Video",
];

const addNoteSchema = {
  body: Joi.object({
    title: Joi.string().allow("").optional(),
    content: Joi.string().allow("").optional(),
    color: Joi.string()
      .valid(...validColors)
      .optional(),
    theme: Joi.string()
      .valid(...validThemes)
      .optional(),
    checklistItems: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        isDone: Joi.boolean().default(false),
      })
    ),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const archivedNoteSchema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
  params: Joi.object({
    noteId: Joi.number().integer().positive().required(),
  }),
  body: Joi.object({
    isArchived: Joi.boolean().optional(),
  }),
};

const editNoteSchema = {
  params: Joi.object({
    noteId: Joi.number().integer().positive().required(),
  }),
  body: Joi.object({
    title: Joi.string().allow("").optional(),
    content: Joi.string().allow("").optional(),
    checklistItems: Joi.array().items(
      Joi.object({
        id: Joi.number().integer().positive().allow(null).optional(),
        title: Joi.string().required(),
        isDone: Joi.boolean().default(false),
      })
    ),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const getNotesSchema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const getPinnedNotesSchema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const getNotesByTagSchema = {
  params: Joi.object({
    tagId: Joi.number().integer().positive().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const getCollabNotesSchema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const getDeletedNotesSchema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const getArchivedNotesSchema = {
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const softDeleteSchema = {
  params: Joi.object({
    noteId: Joi.number().integer().positive().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const restoreNoteSchema = {
  params: Joi.object({
    noteId: Joi.number().integer().positive().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const deleteNoteSchema = {
  params: Joi.object({
    noteId: Joi.number().integer().positive().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const pinNoteSchema = {
  params: Joi.object({
    noteId: Joi.number().integer().positive().required(),
  }),
  body: Joi.object({
    isPinned: Joi.boolean().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const searchNotesSchema = {
  query: Joi.object({
    keyword: Joi.string().allow("").optional(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const settingNoteSchema = {
  params: Joi.object({
    noteId: Joi.number().integer().positive().required(),
  }),
  body: Joi.object({
    color: Joi.string()
      .valid(...validColors)
      .optional(),
    theme: Joi.string()
      .valid(...validThemes)
      .optional(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = {
  addNoteSchema,
  archivedNoteSchema,
  editNoteSchema,
  getNotesSchema,
  getPinnedNotesSchema,
  getNotesByTagSchema,
  getCollabNotesSchema,
  getDeletedNotesSchema,
  getArchivedNotesSchema,
  pinNoteSchema,
  deleteNoteSchema,
  restoreNoteSchema,
  softDeleteSchema,
  searchNotesSchema,
  settingNoteSchema,
};
