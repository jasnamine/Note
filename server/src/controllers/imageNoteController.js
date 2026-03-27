import { StatusCodes } from "http-status-codes";
const imageNoteService = require("../services/imageNoteService");
const uploadImageNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;
    const files = req.files;
    const response = await imageNoteService.uploadImageNote(
      files,
      noteId,
      userId
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteImageNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { imageUrl } = req.body;
    const userId = req.user.id;

    const response = await imageNoteService.deleteImageNote(
      imageUrl,
      noteId,
      userId
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImageNote, deleteImageNote };
