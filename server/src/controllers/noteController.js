import { StatusCodes } from "http-status-codes";
import noteService from "../services/noteService";
const CustomError = require("../ultities/CustomError");
const addNote = async (req, res, next) => {
  try {
    const { title, content, color, theme, checklistItems } = req.body;
    const userId = req.user.id;
    const files = req.files;

    if (files.length > 15) {
      throw new CustomError(
        "Exceed maximum 15 images per note",
        StatusCodes.BAD_REQUEST
      );
    }

    const response = await noteService.addNote(
      { title, content, color, theme, checklistItems },
      userId,
      files
    );

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const editNote = async (req, res, next) => {
  try {
    const { title, content, checklistItems } = req.body;
    const noteId = req.params.noteId;
    const userId = req.user.id;

    const response = await noteService.editNote(
      { title, content, checklistItems },
      noteId,
      userId
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await noteService.getNotes(userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getPinnedNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await noteService.getPinnedNotes(userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getNotesByTag = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tagId = req.params.tagId;

    const response = await noteService.getNotesByTag(userId, tagId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getCollabNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await noteService.getCollabNotes(userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    const response = await noteService.getNoteById(userId, noteId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const softDelete = async (req, res, next) => {
  try {
    let noteId = req.params.noteId;
    let userId = req.user.id;
    const response = await noteService.softDelete(noteId, userId);
   return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getDeletedNotes = async (req, res, next) => {
  try {
    let userId = req.user.id;
    const response = await noteService.getDeletedNotes(userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const restoreNote = async (req, res, next) => {
  try {
    let noteId = req.params.noteId;
    let userId = req.user.id;

    const response = await noteService.restoreNote(noteId, userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    let noteId = req.params.noteId;
    let userId = req.user.id;

    const response = await noteService.deleteNote(noteId, userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const pinNote = async (req, res, next) => {
  try {
    let noteId = req.params.noteId;
    let userId = req.user.id;
    let { isPinned } = req.body;

    const response = await noteService.pinNote(noteId, userId, isPinned);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const searchNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { keyword } = req.query;

    const response = await noteService.searchNotes(userId, { keyword });
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const settingNote = async (req, res, next) => {
  try {
    const { theme, color } = req.body;
    const userId = req.user.id;
    const noteId = req.params.noteId;
    const response = await noteService.settingNote(
      userId,
      noteId,
      color,
      theme
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const archivedNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { isArchived } = req.body;
    const { noteId } = req.params;
    const response = await noteService.archivedNote(userId, noteId, isArchived);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getArchivedNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await noteService.getArchivedNotes(userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNote,
  editNote,
  getNotes,
  getPinnedNotes,
  getNotesByTag,
  getCollabNotes,
  getNoteById,
  softDelete,
  getDeletedNotes,
  restoreNote,
  deleteNote,
  pinNote,
  archivedNote,
  getArchivedNotes,
  searchNotes,
  settingNote,
};
