const db = require("../models");
const CustomError = require("../ultities/CustomError");

import { StatusCodes } from "http-status-codes";

const getTags = async (userId) => {
  try {
    const tags = await db.Tag.findAll({
      where: { userID: userId },
      attributes: ["id", "name"],
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Tags retrieved successfully",
      DT: tags,
    };
  } catch (error) {
    throw error;
  }
};

const createTag = async (userId, name) => {
  try {
    if (!name || !userId) {
      throw new CustomError("Missing tag name or userId", StatusCodes.BAD_REQUEST);
    }
    const tag = await db.Tag.create({ name, userID: userId });

    return {
      statusCode: StatusCodes.OK,
      message: "Tag created successfully",
      DT: { id: tag.id, name },
    };
  } catch (error) {
    throw error;
  }
};

const updateTag = async (userId, tagId, tagName) => {
  try {
    const tag = await db.Tag.findOne({ where: { userID: userId, id: tagId } });
    if (!tag) {
      throw new CustomError("Tag not found or unauthorized", StatusCodes.NOT_FOUND);
    }

    await db.Tag.update(
      { name: tagName },
      { where: { userID: userId, id: tagId } }
    );

    const updatedTag = await db.Tag.findOne({
      where: { userID: userId, id: tagId },
      attributes: ["id", "name"],
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Tag updated successfully",
      DT: updatedTag,
    };
  } catch (error) {
    throw error;
  }
};

const deleteTag = async (userId, tagId) => {
  try {
    const tag = await db.Tag.findOne({ where: { id: tagId, userID: userId } });
    if (!tag) {
      throw new CustomError("Tag not found or unauthorized", StatusCodes.NOT_FOUND);
    }

    await db.NoteTag.destroy({ where: { tagID: tagId } });

    await tag.destroy();

    return {
      statusCode: StatusCodes.OK,
      message: "Tag deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTags,
  createTag,
  updateTag,
  deleteTag,
};
