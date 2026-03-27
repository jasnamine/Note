const jwt = require("jsonwebtoken");
const db = require("../models");
const CustomError = require("../ultities/CustomError");
import { StatusCodes } from "http-status-codes";
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new CustomError("Missing access token", StatusCodes.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    const user = await db.User.findByPk(decoded.id, {
      attributes: ["id", "email"],
    });

    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }

    // req.user = user;
    req.user = user.toJSON();
    next();
  } catch (error) {
    next(error);
  }
};

const restrictNoteAccess =
  ({
    allowOwner = true,
    allowCollaborator = true,
    requiredPermission = null,
  } = {}) =>
  async (req, res, next) => {
    try {
      const noteId = req.params.noteId || req.body.noteId || req.query.noteId;
      if (!noteId) {
        throw new CustomError("NoteId is required", StatusCodes.BAD_REQUEST);
      }

      const userId = req.user.id;

      const note = await db.Note.findOne({
        where: { id: noteId },
        paranoid: false,
      });

      if (!note) {
        throw new CustomError("Note not found", StatusCodes.NOT_FOUND);
      }

      const isOwner = note.userID === userId;
      let collaborator = null;

      if (allowCollaborator) {
        collaborator = await db.NoteCollaborator.findOne({
          where: { noteID: noteId, userID: userId },
        });
      }

      if (!allowOwner && !allowCollaborator) {
        throw new CustomError("Access configuration error", StatusCodes.INTERNAL_SERVER_ERROR);
      }

      if (allowOwner && !allowCollaborator && !isOwner) {
        throw new CustomError("Only note owner allowed", StatusCodes.FORBIDDEN);
      }

      if (!allowOwner && allowCollaborator && !collaborator) {
        throw new CustomError("Only collaborators allowed", StatusCodes.FORBIDDEN);
      }

      if (allowOwner && allowCollaborator && !isOwner && !collaborator) {
        throw new CustomError("No access to this note", StatusCodes.FORBIDDEN);
      }

      if (
        collaborator &&
        requiredPermission &&
        collaborator.permission !== requiredPermission
      ) {
        throw new CustomError(`Requires ${requiredPermission} permission`, StatusCodes.FORBIDDEN);
      }

      // req.note = note;
      // req.isCollaborator = !!collaborator;
      // req.collaborator = collaborator;

      next();
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  verifyToken,
  restrictNoteAccess,
};
