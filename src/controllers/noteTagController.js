const noteTagService = require("../services/noteTagService");

import { StatusCodes } from "http-status-codes";

const addTagToNote = async (req, res, next) => {
  try {
    const { noteId, tagId } = req.body;
    const response = await noteTagService.addTagToNote({ noteId, tagId });
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const addMultipleTags = async (req, res, next) => {
  try {
    const { noteId, tagIDs } = req.body;

    const response = await noteTagService.addMultipleTags({ noteId, tagIDs });
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getTagsOfNote = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const response = await noteTagService.getTagsOfNote(noteId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const removeTagFromNote = async (req, res, next) => {
  try {
    const { noteId, tagIDs } = req.body;

    const response = await noteTagService.removeTagFromNote({ noteId, tagIDs });
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const removeTagNote = async (req, res, next) => {
  try {
    const { noteId, tagId } = req.body;
    const response = await noteTagService.removeTagNote({ noteId, tagId });
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addTagToNote,
  addMultipleTags,
  getTagsOfNote,
  removeTagFromNote,
  removeTagNote,
};
