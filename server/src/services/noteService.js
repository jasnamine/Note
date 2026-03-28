const db = require("../models");
const { Op, col } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../ultities/CustomError");

const addNote = async (noteData, userId, files) => {
  try {
    const { title, content, color, theme, checklistItems } = noteData;
    const createdNote = await db.Note.create({
      title,
      content: content || null,
      userID: userId,
      color: color || "Default",
      theme: theme || "Default",
    });

    await db.NotePreference.create({
      noteID: createdNote.id,
      userID: userId,
      isPinned: false,
      isArchived: false,
    });

    if (Array.isArray(checklistItems) && checklistItems.length > 0) {
      const checklistData = checklistItems.map((item) => ({
        noteID: createdNote.id,
        title: item.title,
        isDone: item.isDone || false,
      }));
      await db.Checklist.bulkCreate(checklistData);
    }

    if (files.length > 0) {
      const noteImages = files.map((file) => ({
        noteID: createdNote.id,
        url: file.path,
      }));
      await db.NoteImage.bulkCreate(noteImages);
    }

    const fullNote = await db.Note.findOne({
      where: { id: createdNote.id },
      include: [
        {
          model: db.Checklist,
          as: "checklists",
          attributes: ["id", "title", "isDone"],
        },
        {
          model: db.NoteImage,
          as: "images",
          attributes: ["id", "url"],
        },
        {
          model: db.Tag,
          as: "tags",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Add note successfully",
      DT: fullNote,
    };
  } catch (error) {
    throw error;
  }
};

const editNote = async (noteData, noteId, userId) => {
  try {
    const { title, content, checklistItems } = noteData;

    const note =
      (await db.Note.findOne({
        where: { id: noteId, userID: userId, deletedAt: null },
      })) ||
      (await db.NoteCollaborator.findOne({
        where: { noteID: noteId, userID: userId, permission: "edit" },
      }));

    if (!note) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.FORBIDDEN
      );
    }

    await db.Note.update(
      {
        title: title !== undefined ? title : note.title,
        content: content !== undefined ? content : note.content,
      },
      { where: { id: noteId } }
    );

    if (Array.isArray(checklistItems) && checklistItems.length > 0) {
      const incomingChecklistIds = checklistItems
        .filter((item) => item.id)
        .map((item) => item.id);

      await db.Checklist.destroy({
        where: {
          noteID: noteId,
          id: { [db.Sequelize.Op.notIn]: incomingChecklistIds },
        },
      });

      for (const item of checklistItems) {
        if (item.id) {
          await db.Checklist.update(
            {
              title: item.title || "",
              isDone: item.isDone || false,
            },
            { where: { id: item.id, noteID: noteId } }
          );
        } else {
          await db.Checklist.create({
            noteID: noteId,
            title: item.title || "",
            isDone: item.isDone || false,
          });
        }
      }
    } else {
      await db.Checklist.destroy({ where: { noteID: noteId } });
    }

    const updatedNote = await db.Note.findOne({
      where: { id: noteId },
      include: [{ model: db.Checklist, as: "checklists" }],
    });

    const checklistHistory = updatedNote.checklists.map((item) => ({
      id: item.id,
      title: item.title,
      isDone: item.isDone,
    }));

    await db.NoteHistory.create({
      noteID: noteId,
      title: updatedNote.title,
      content: updatedNote.content,
      checklistItems: checklistHistory,
      action: "update",
      modifiedBy: userId,
      modifiedAt: new Date(),
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Edit note successfully",
      DT: {
        id: updatedNote.id,
        title: updatedNote.title,
        content: updatedNote.content,
        checklists: updatedNote.checklists || [],
        updatedAt: updatedNote.updatedAt,
      },
    };
  } catch (error) {
    throw error;
  }
};

const getNotes = async (userId) => {
  try {
    const notes = await db.Note.findAll({
      where: {
        userID: userId,
        deletedAt: null,
      },
      include: [
        {
          model: db.Checklist,
          as: "checklists",
          attributes: ["id", "title", "isDone"],
        },
        {
          model: db.NoteImage,
          as: "images",
          attributes: ["id", "url"],
        },
        {
          model: db.Reminder,
          as: "reminders",
          attributes: ["id", "time", "repeat"],
        },
        {
          model: db.Tag,
          as: "tags",
          through: { attributes: [] },
          attributes: ["id", "name"],
          where: {
            userId: userId,
          },
          required: false,
        },
        {
          model: db.NoteCollaborator,
          as: "collaborators",
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "fullname", "avatar", "email", "username"],
            },
          ],
        },
        {
          model: db.NotePreference,
          as: "preferences",
          where: { isPinned: false, isArchived: false, userID: userId },
        },
      ],
    });

    return {
      statusCode: StatusCodes.OK,
      message: notes.length === 0 ? "Empty notes" : "Get notes successfully",
      DT: notes,
    };
  } catch (error) {
    throw error;
  }
};

const getPinnedNotes = async (userId) => {
  try {
    const notes = await db.Note.findAll({
      where: {
        userID: userId,
        deletedAt: null,
      },
      include: [
        {
          model: db.Checklist,
          as: "checklists",
          attributes: ["id", "title", "isDone"],
        },
        {
          model: db.NoteImage,
          as: "images",
          attributes: ["id", "url"],
        },
        {
          model: db.Reminder,
          as: "reminders",
          attributes: ["id", "time", "repeat"],
        },
        {
          model: db.Tag,
          as: "tags",
          through: { attributes: [] },
          attributes: ["id", "name"],
          where: {
            userId: userId,
          },
          required: false,
        },
        {
          model: db.NoteCollaborator,
          as: "collaborators",
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "fullname", "avatar", "email", "username"],
            },
          ],
        },
        {
          model: db.NotePreference,
          as: "preferences",
          where: { isPinned: true, isArchived: false, userID: userId },
        },
      ],
      order: [
        [db.Sequelize.col("preferences.isPinned"), "DESC"],
        [db.Sequelize.col("preferences.pinnedAt"), "DESC"],
      ],
    });

    return {
      statusCode: StatusCodes.OK,
      message:
        notes.length === 0 ? "Empty notes" : "Get pinned notes successfully",
      DT: notes,
    };
  } catch (error) {
    throw error;
  }
};

const getNotesByTag = async (userId, tagId) => {
  try {
    const notes = await db.Note.findAll({
      where: {
        userID: userId,
        deletedAt: null,
        id: {
          [Op.in]: db.Sequelize.literal(
            `(SELECT noteID FROM note_tags WHERE tagID = ${tagId})`
          ),
        },
      },
      include: [
        {
          model: db.Tag,
          as: "tags",
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
        {
          model: db.Checklist,
          as: "checklists",
          attributes: ["id", "title", "isDone"],
          required: false,
        },
        {
          model: db.NoteImage,
          as: "images",
          attributes: ["id", "url"],
          required: false,
        },
        {
          model: db.Reminder,
          as: "reminders",
          attributes: ["id", "time", "repeat"],
          required: false,
        },
        {
          model: db.NoteCollaborator,
          as: "collaborators",
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "fullname", "avatar", "email", "username"],
            },
          ],
          required: false,
        },
        {
          model: db.NotePreference,
          as: "preferences",
          where: { userID: userId },
          required: false,
        },
      ],
    });

    return {
      statusCode: StatusCodes.OK,
      message:
        notes.length === 0 ? "Empty notes" : "Get notes by tag successfully",
      DT: notes,
    };
  } catch (error) {
    throw error;
  }
};

const getCollabNotes = async (userId) => {
  try {
    const notes = await db.NoteCollaborator.findAll({
      where: {
        userID: userId,
      },
      include: [
        {
          model: db.Note,
          as: "note",
          include: [
            {
              model: db.User,
              as: "owner",
              attributes: ["id", "fullname", "avatar", "email", "username"],
            },
            {
              model: db.Checklist,
              as: "checklists",
              attributes: ["id", "title", "isDone"],
            },
            {
              model: db.NoteImage,
              as: "images",
              attributes: ["id", "url"],
            },
            {
              model: db.Reminder,
              as: "reminders",
              attributes: ["id", "time", "repeat"],
            },
            {
              model: db.Tag,
              as: "tags",
              through: { attributes: [] },
              attributes: ["id", "name"],
              required: false,
            },
            {
              model: db.NoteCollaborator,
              as: "collaborators",
              include: [
                {
                  model: db.User,
                  as: "user",
                  attributes: ["id", "username"],
                },
              ],
            },
            {
              model: db.NotePreference,
              as: "preferences",
              where: { userID: userId },
            },
          ],
        },
      ],
      order: [
        [col("note->preferences.isPinned"), "DESC"],
        [col("note->preferences.pinnedAt"), "DESC"],
      ],
    });

    return {
      statusCode: StatusCodes.OK,
      message:
        notes.length === 0 ? "Empty notes" : "Get collab notes successfully",
      DT: notes,
    };
  } catch (error) {
    throw error;
  }
};

const getNoteById = async (userId, noteId) => {
  try {
    const note = await db.Note.findOne({
      where: { id: noteId, deletedAt: null },
      include: [
        {
          model: db.NoteCollaborator,
          as: "collaborators",
          where: { userID: userId },
          required: false,
        },
      ],
    });

    if (!note) {
      throw new CustomError("Note not found or deleted", StatusCodes.NOT_FOUND);
    }

    const isOwner = note.userID === userId;
    const isCollaborator = note.collaborators?.length > 0;
    if (!isOwner && !isCollaborator) {
      throw new CustomError(
        "Unauthorized to access note",
        StatusCodes.FORBIDDEN
      );
    }

    return {
      statusCode: StatusCodes.OK,
      message: "Note retrieved successfully",
      DT: note,
    };
  } catch (error) {
    throw error;
  }
};

const softDelete = async (noteId, userId) => {
  try {
    const note = await db.Note.findOne({
      where: { id: noteId, deletedAt: null },
    });

    if (!note) {
      throw new CustomError(
        "Note not found or already deleted",
        StatusCodes.NOT_FOUND,
      );
    }

    if (note.userID !== userId) {
      throw new CustomError(
        "Unauthorized to delete note",
        StatusCodes.FORBIDDEN,
      );
    }

    await Promise.all([
      db.NoteCollaborator.destroy({ where: { noteID: noteId } }),

      db.Reminder.destroy({ where: { noteID: noteId } }),

      db.NotePreference.destroy({
        where: {
          noteID: noteId,
          userID: { [db.Sequelize.Op.ne]: userId }, 
        },
      }),

    ]);

    await note.destroy();

    return {
      statusCode: StatusCodes.OK,
      message: "Note moved to trash",
      DT: {},
    };
  } catch (error) {
    throw error;
  }
};

const getDeletedNotes = async (userId) => {
  try {
    let notes = await db.Note.findAll({
      where: {
        userID: userId,
        deletedAt: { [db.Sequelize.Op.not]: null },
      },
      paranoid: false,
      order: [
        ["updatedAt", "DESC"],
        ["id", "ASC"],
      ],
      include: [
        {
          model: db.Checklist,
          as: "checklists",
          attributes: ["id", "title", "isDone"],
        },
        {
          model: db.NoteImage,
          as: "images",
          attributes: ["id", "url"],
        },
        {
          model: db.Reminder,
          as: "reminders",
          attributes: ["id", "time", "repeat"],
        },
        {
          model: db.Tag,
          as: "tags",
          through: { attributes: [] },
          attributes: ["id", "name"],
          where: {
            userId: userId,
          },
          required: false,
        },
        {
          model: db.NoteCollaborator,
          as: "collaborators",
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "fullname", "avatar", "email", "username"],
            },
          ],
        },
      ],
    });

    return {
      statusCode: StatusCodes.OK,
      message:
        notes.length === 0
          ? "Trash can empty"
          : "Get deleted notes successfully",
      DT: notes,
    };
  } catch (error) {
    throw error;
  }
};

const restoreNote = async (noteId, userId) => {
  try {
    let note = await db.Note.findOne({
      where: { id: noteId, userID: userId },
      paranoid: false,
    });

    if (!note) {
      throw new CustomError(
        "Note not found in trash or unauthorized",
        StatusCodes.NOT_FOUND
      );
    }

    await note.restore();

    return {
      statusCode: StatusCodes.OK,
      message: "Note restored successfully",
    };
  } catch (error) {
    throw error;
  }
};

const deleteNote = async (noteId, userId) => {
  try {
    const note = await db.Note.findOne({
      where: { id: noteId },
      paranoid: false,
    });

    if (!note) {
      throw new CustomError("Note not found", StatusCodes.NOT_FOUND);
    }

    if (note.userID !== userId) {
      throw new CustomError(
        "Unauthorized to delete note",
        StatusCodes.FORBIDDEN
      );
    }

    await Promise.all([
      db.NoteTag.destroy({ where: { noteID: noteId } }),
      db.Reminder.destroy({ where: { noteID: noteId } }),
      db.NoteCollaborator.destroy({ where: { noteID: noteId } }),
      db.NoteImage.destroy({ where: { noteID: noteId } }),
      db.Checklist.destroy({ where: { noteID: noteId } }),
      db.NotePreference.destroy({ where: { noteID: noteId } }),
      db.NoteHistory.destroy({ where: { noteID: noteId } }),
    ]);

    await note.destroy({ force: true });

    return {
      statusCode: StatusCodes.OK,
      message: "Note deleted permanently",
      DT: {},
    };
  } catch (error) {
    throw error;
  }
};

const pinNote = async (noteId, userId, isPinned) => {
  try {
    let note = await db.NotePreference.findOne({
      include: [
        {
          model: db.Note,
          as: "note",
          where: { deletedAt: null },
        },
      ],
      where: { userID: userId, noteID: noteId },
    });

    const date = new Date();

    if (!note) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.NOT_FOUND
      );
    }

    await db.NotePreference.update(
      { isPinned, pinnedAt: !note.isPinned ? date : null },
      { where: { noteID: noteId, userID: userId } }
    );

    let updateNotes = await db.NotePreference.findOne({
      include: [
        {
          model: db.Note,
          as: "note",
          where: { deletedAt: null },
        },
      ],
      where: { userID: userId, noteID: noteId },
      attributes: ["id", "isPinned", "pinnedAt", "createdAt"],
    });

    return {
      statusCode: StatusCodes.OK,
      message: `Note ${isPinned ? "pinned" : "unpinned"} successfully`,
      DT: updateNotes,
    };
  } catch (error) {
    throw error;
  }
};

const searchNotes = async (userId, { keyword }) => {
  try {
    const notes = await db.Note.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { userID: userId },
              { "$collaborator.id$": userId },
            ],
          },
          {
            [Op.or]: [
              { title: { [Op.like]: `%${keyword}%` } },
              { content: { [Op.like]: `%${keyword}%` } },
              { "$tags.name$": { [Op.like]: `%${keyword}%` } },
            ],
          },
          { deletedAt: null },
        ],
      },
      include: [
        {
          model: db.Tag,
          as: "tags",
          through: { attributes: [] },
          required: false,
        },
        {
          model: db.User,
          as: "collaborator", 
          attributes: ["id", "username", "avatar"],
          through: { attributes: ["permission"] },
          required: false,
        },
      ],
      subQuery: false,
      distinct: true,
    });

    return {
      statusCode: 200,
      message: "Search completed",
      DT: notes,
    };
  } catch (error) {
    throw error;
  }
};

const settingNote = async (userId, noteId, color, theme) => {
  try {
    const note =
      (await db.Note.findOne({
        where: { id: noteId, userID: userId, deletedAt: null },
      })) ||
      (await db.NoteCollaborator.findOne({
        where: { noteID: noteId, userID: userId, permission: "edit" },
      }));

    if (!note) {
      throw new CustomError("Note not found", StatusCodes.NOT_FOUND);
    }

    await db.Note.update(
      {
        color: color,
        theme: theme,
      },
      {
        where: {
          id: noteId,
        },
      }
    );

    const setting = await db.Note.findOne({
      where: { id: noteId },
      attributes: ["color", "theme", "id"],
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Note settings successfully",
      DT: setting,
    };
  } catch (error) {
    throw error;
  }
};

const archivedNote = async (userId, noteId, isArchived) => {
  try {
    const note = await db.NotePreference.findOne({
      where: { userID: userId, noteID: noteId },
    });

    if (!note) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.NOT_FOUND
      );
    }

    await db.NotePreference.update(
      { isArchived },
      { where: { userID: userId, noteID: noteId } }
    );

    let updateNotes = await db.NotePreference.findOne({
      include: [
        {
          model: db.Note,
          as: "note",
          where: { deletedAt: null },
        },
      ],
      where: { userID: userId, noteID: noteId },
      attributes: ["id", "isArchived", "noteID", "userID"],
    });

    return {
      statusCode: StatusCodes.OK,
      message: `Note ${isArchived ? "pinned" : "unpinned"} successfully`,
      DT: updateNotes,
    };
  } catch (error) {
    throw error;
  }
};

const getArchivedNotes = async (userId) => {
  try {
    const notes = await db.Note.findAll({
      where: {
        userID: userId,
        deletedAt: null,
      },
      include: [
        {
          model: db.Checklist,
          as: "checklists",
          attributes: ["id", "title", "isDone"],
        },
        {
          model: db.NoteImage,
          as: "images",
          attributes: ["id", "url"],
        },
        {
          model: db.Reminder,
          as: "reminders",
          attributes: ["id", "time", "repeat"],
        },
        {
          model: db.Tag,
          as: "tags",
          through: { attributes: [] },
          attributes: ["id", "name"],
          where: {
            userId: userId,
          },
          required: false,
        },
        {
          model: db.NoteCollaborator,
          as: "collaborators",
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "fullname", "avatar", "email", "username"],
            },
          ],
        },
        {
          model: db.NotePreference,
          as: "preferences",
          where: { isArchived: true, userID: userId },
        },
      ],
      order: [[db.Sequelize.col("preferences.updatedAt"), "ASC"]],
    });
    return {
      statusCode: StatusCodes.OK,
      message:
        notes.length === 0 ? "Empty notes" : "Get archived notes successfully",
      DT: notes,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addNote,
  editNote,
  getNotes,
  getNoteById,
  getCollabNotes,
  softDelete,
  getDeletedNotes,
  restoreNote,
  deleteNote,
  archivedNote,
  getArchivedNotes,
  pinNote,
  searchNotes,
  settingNote,
  getPinnedNotes,
  getNotesByTag,
};
