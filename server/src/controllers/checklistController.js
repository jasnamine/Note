const { StatusCodes } = require("http-status-codes");
const checklistService = require("../services/checklistService");

const addChecklistItem = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.user.id;
    const { title, isDone, order } = req.body;

    const response = await checklistService.addChecklistItem(userId, noteId, {
      title,
      isDone,
      order,
    });
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const updateChecklistItem = async (req, res, next) => {
  try {
    const { noteId, checklistId } = req.params;

    const userId = req.user.id;
    const { title, isDone, order } = req.body;

    const response = await checklistService.updateChecklistItem(
      userId,
      { noteId, checklistId },
      { title, isDone, order },
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteChecklistItem = async (req, res, next) => {
  try {
    const { noteId, checklistId } = req.params;
    const userId = req.user.id;
    const response = await checklistService.deleteChecklistItem(userId, {
      noteId,
      checklistId,
    });
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getChecklist = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.user.id;
    const response = await checklistService.getChecklist(userId, noteId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  getChecklist,
};
