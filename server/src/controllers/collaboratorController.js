const { StatusCodes } = require("http-status-codes");
const collaboratorService = require("../services/collaboratorService");
require("dotenv").config();

const getCollaborators = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.user.id;
    const response = await collaboratorService.getCollaborators(userId, noteId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const addCollaboratorInvitation = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { email, permission } = req.body;
    const userId = req.user.id;
    const response = await collaboratorService.addCollaboratorInvitation(
      userId,
      noteId,
      { email, permission },
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const acceptCollaboratorInvitation = async (req, res, next) => {
  try {
    const { token } = req.query;
    const response = await collaboratorService.acceptCollaboratorInvitation(
      token,
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const leaveNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;
    const response = await collaboratorService.leaveNote(noteId, userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const removeCollaborator = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { noteId, collaboratorUserId } = req.body;
    const response = await collaboratorService.removeCollaborator(
      noteId,
      collaboratorUserId,
      userId,
    );

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const updateCollaboratorPermission = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { noteId, newPermission, collaboratorUserId } = req.body;

    const response = await collaboratorService.updateCollaboratorPermission(
      userId,
      noteId,
      collaboratorUserId,
      newPermission,
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollaborators,
  addCollaboratorInvitation,
  acceptCollaboratorInvitation,
  leaveNote,
  removeCollaborator,
  updateCollaboratorPermission,
};
