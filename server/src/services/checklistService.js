const db = require("../models");
const CustomError = require("../ultities/CustomError");
const { StatusCodes } = require("http-status-codes");

const addChecklistItem = async (userId, noteId, itemData) => {
  try {
    const note = await db.Note.findOne({ where: { id: noteId } });
    if (!note || note.userID !== userId) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.FORBIDDEN
      );
    }

    const { title, isDone = false, order = 0 } = itemData;

    const checklistItem = await db.Checklist.create({
      noteID: noteId,
      title,
      isDone,
      order,
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Checklist item added successfully",
      DT: checklistItem,
    };
  } catch (error) {
    throw error;
  }
};

const updateChecklistItem = async (
  userId,
  { noteId, checklistId },
  checklistItem
) => {
  try {
    const note = await db.Note.findOne({ where: { id: noteId } });
    if (!note || note.userID !== userId) {
      throw new CustomError("Checklist item not found", StatusCodes.NOT_FOUND);
    }

    const checklist = await db.Checklist.findOne({
      where: { id: checklistId, noteID: noteId },
    });

    if (!checklist) {
      throw new CustomError("Checklist item not found", StatusCodes.NOT_FOUND);
    }

    await db.Checklist.update(
      {
        title:
          checklistItem.title !== undefined
            ? checklistItem.title
            : checklist.title,
        isDone:
          checklistItem.isDone !== undefined
            ? checklistItem.isDone
            : checklist.isDone,
        order:
          checklistItem.order !== undefined
            ? checklistItem.order
            : checklist.order,
      },
      { where: { id: checklistId } }
    );

    const updatedChecklist = await db.Checklist.findOne({
      where: { id: checklistId },
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Checklist item updated successfully",
      DT: updatedChecklist,
    };
  } catch (error) {
    throw error;
  }
};

const deleteChecklistItem = async (userId, { noteId, checklistId }) => {
  try {
    const note = await db.Note.findOne({ where: { id: noteId } });
    if (!note || note.userID !== userId) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.FORBIDDEN
      );
    }

    const checklist = await db.Checklist.findOne({
      where: { id: checklistId, noteID: noteId },
    });

    if (!checklist) {
      throw new CustomError("Checklist item not found", StatusCodes.NOT_FOUND);
    }

    await db.Checklist.destroy({ where: { id: checklistId } });
    return {
      statusCode: StatusCodes.OK,
      message: "Checklist item deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};

const getChecklist = async (userId, noteId) => {
  try {
    const note = await db.Note.findOne({ where: { id: noteId } });
    if (
      !note ||
      (note.userID !== userId &&
        !(await db.NoteCollaborator.findOne({
          where: { noteID: noteId, userID: userId },
        })))
    ) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.FORBIDDEN
      );
    }

    const checklist = await db.Checklist.findAll({
      where: { noteID: noteId },
      attributes: ["id", "title", "isDone", "order"],
      order: [["order", "ASC"]],
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Checklist retrieved successfully",
      DT: checklist,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  getChecklist,
};
