const db = require("../models");
const CustomError = require("../ultities/CustomError");
import { StatusCodes } from "http-status-codes";

const addTagToNote = async ({ noteId, tagId }) => {
  try {
    const note = await db.Note.findOne({
      where: { id: noteId },
    });

    if (!note) {
      throw new CustomError("Note not found", StatusCodes.NOT_FOUND);
    }

    const tag = await db.Tag.findOne({
      where: { id: tagId },
      attributes: ["id", "name"],
    });

    if (!tag) {
      throw new CustomError("Tag not found", StatusCodes.NOT_FOUND);
    }

    const existingNoteTag = await db.NoteTag.findOne({
      where: { noteID: noteId, tagID: tagId },
    });

    if (existingNoteTag) {
      throw new CustomError(
        "Tag already assigned to note",
        StatusCodes.BAD_REQUEST
      );
    }

    await db.NoteTag.create({ noteID: noteId, tagID: tagId });

    return {
      statusCode: StatusCodes.OK,
      message: "Tag added to note successfully",
      DT: { id: tag.id, name: tag.name },
    };
  } catch (error) {
    throw error;
  }
};

const addMultipleTags = async ({ noteId, tagIDs }) => {
  try {
    let existingNote = await db.Note.findOne({
      where: { id: noteId },
    });

    if (!existingNote) {
      throw new CustomError("Note not found", StatusCodes.NOT_FOUND);
    }

    const existingTags = await db.Tag.findAll({
      where: { id: tagIDs },
      attributes: ["id"],
    });

    if (!existingTags) {
      throw new CustomError("Tag not found", StatusCodes.NOT_FOUND);
    }

    const existingTagIDs = existingTags.map((tag) => tag.id);

    const invalidTagIDs = tagIDs.filter((id) => !existingTagIDs.includes(id));
    if (invalidTagIDs.length > 0) {
      throw new CustomError(
        `The following tag IDs do not exist: [${invalidTagIDs.join(", ")}]`,
        StatusCodes.NOT_FOUND
      );
    }

    const recordsToCreate = tagIDs.map((tagId) => ({
      noteID: noteId,
      tagID: tagId,
    }));

    await db.NoteTag.bulkCreate(recordsToCreate);

    const tags = await db.NoteTag.findAll({
      where: { noteID: noteId },
      include: {
        model: db.Tag,
        as: "tag",
        attributes: ["name"],
      },
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Tags linked to note successfully",
      DT: tags.map((tag) => ({
        noteId: tag.noteID,
        tagName: tag.tag.name,
        tagId: tag.tagID,
      })),
    };
  } catch (error) {
    throw error;
  }
};

const getTagsOfNote = async (noteId) => {
  try {
    // Kiểm tra note tồn tại
    const existingNote = await db.Note.findOne({
      where: { id: noteId },
    });

    if (!existingNote) {
      throw new CustomError("Note not found", StatusCodes.NOT_FOUND);
    }

    const tags = await db.Tag.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: db.Note,
          as: "notes",
          where: { id: noteId },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Get tags of note successfully",
      DT: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  } catch (error) {
    throw error;
  }
};

const removeTagFromNote = async ({ noteId, tagIDs }) => {
  try {
    // Kiểm tra note tồn tại
    const existingNote = await db.Note.findOne({ where: { id: noteId } });
    if (!existingNote) {
      throw new CustomError("Note not found", 404, 1);
    }

    // Kiểm tra các tag tồn tại
    const existingTags = await db.Tag.findAll({
      where: { id: tagIDs },
      attributes: ["id"],
    });

    const existingTagIDs = existingTags.map((tag) => tag.id);
    const invalidTagIDs = tagIDs.filter((id) => !existingTagIDs.includes(id));

    if (invalidTagIDs.length > 0) {
      throw new CustomError(
        `The following tag IDs do not exist: [${invalidTagIDs.join(", ")}]`,
        404,
        1
      );
    }

    // Xóa các NoteTags
    await db.NoteTag.destroy({
      where: {
        noteID: noteId,
        tagID: tagIDs,
      },
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Tags removed successfully",
    };
  } catch (error) {
    throw error;
  }
};

const removeTagNote = async ({ noteId, tagId }) => {
  try {
    // Kiểm tra note tồn tại
    const existingNote = await db.Note.findOne({ where: { id: noteId } });
    if (!existingNote) {
      throw new CustomError("Note not found", StatusCodes.NOT_FOUND);
    }

    // Kiểm tra các tag tồn tại
    const existingTags = await db.Tag.findOne({
      where: { id: tagId },
      attributes: ["id"],
    });

    if (!existingTags) {
      throw new CustomError("The following tag ID do not exist", StatusCodes.NOT_FOUND);
    }

    // Xóa các NoteTags
    await db.NoteTag.destroy({
      where: {
        noteID: noteId,
        tagID: tagId,
      },
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Tag removed successfully",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addTagToNote,
  addMultipleTags,
  getTagsOfNote,
  removeTagFromNote,
  removeTagNote,
};
