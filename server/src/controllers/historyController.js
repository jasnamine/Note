const { StatusCodes } = require("http-status-codes");
const historyService = require("../services/historyService");

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
