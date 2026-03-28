const Joi = require("joi");

const getCollaboratorsSchema = {
  params: Joi.object({
    noteId: Joi.number().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const addCollaboratorInvitationSchema = {
  params: Joi.object({
    noteId: Joi.number().required(),
  }),
  body: Joi.object({
    email: Joi.string().email().required(),
    permission: Joi.string().valid("view", "edit").required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const acceptCollaboratorInvitationSchema = {
  query: Joi.object({
    token: Joi.string().required(),
  }),
};

const removeCollaboratorSchema = {
  body: Joi.object({
    noteId: Joi.number().required(),
    collaboratorUserId: Joi.number().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const updateCollaboratorPermissionSchema = {
  body: Joi.object({
    noteId: Joi.number().required(),
    collaboratorUserId: Joi.number().required(),
    newPermission: Joi.string().valid("view", "edit").required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

const leaveNoteSchema = {
  params: Joi.object({
    noteId: Joi.number().required(),
  }),
  user: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = {
  getCollaboratorsSchema,
  addCollaboratorInvitationSchema,
  acceptCollaboratorInvitationSchema,
  removeCollaboratorSchema,
  updateCollaboratorPermissionSchema,
  leaveNoteSchema,
};
