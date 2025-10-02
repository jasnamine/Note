import historyService from "../services/historyService";

import { StatusCodes } from "http-status-codes";

const getNoteHistory = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.user.id;

    const response = await historyService.getNoteHistory(userId, noteId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { getNoteHistory };
