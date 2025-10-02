const db = require("../models");
const CustomError = require("../ultities/CustomError");
import { StatusCodes } from "http-status-codes";

const getNoteHistory = async (userId, noteId) => {
  try {
    const note = await db.Note.findOne({
      where: { id: noteId, deletedAt: null },
      attributes: ["id", "userID", "title", "content"],
      include: [
        {
          model: db.NoteCollaborator,
          as: "collaborators",
          attributes: ["userID", "permission"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });

    if (!note) {
      throw new CustomError("Note not found or deleted", StatusCodes.BAD_REQUEST);
    }

    // Kiểm tra quyền truy cập
    const isOwner = note.userID == userId;

    const isCollaborator = note.collaborators.some(
      (collab) => collab.userID == userId
    );

    if (!isOwner && !isCollaborator) {
      throw new CustomError("Unauthorized to view note history", StatusCodes.FORBIDDEN);
    }

    // Lấy lịch sử chỉnh sửa
    const history = await db.NoteHistory.findAll({
      where: { noteID: noteId },
      attributes: [
        "id",
        "title",
        "content",
        "modifiedBy",
        "modifiedAt",
      ],
      include: [
        {
          model: db.User,
          as: "modifier",
          attributes: ["id", "email", "username"],
        },
      ],
      order: [["modifiedAt", "DESC"]],
      limit: 100,
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Note history retrieved successfully",
      DT: history,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { getNoteHistory };
