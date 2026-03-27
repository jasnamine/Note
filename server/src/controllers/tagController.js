const tagService = require("../services/tagService");
import { StatusCodes } from "http-status-codes";

const getTags = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await tagService.getTags(userId);
     return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    const response = await tagService.createTag(userId, name);
     return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const updateTag = async (req, res, next) => {
  try {
    const tagId = req.params.tagId;
    const userId = req.user.id;
    const { tagName } = req.body;

    const response = await tagService.updateTag(userId, tagId, tagName);
     return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const tagId = req.params.tagId;
    const userId = req.user.id;
    const response = await tagService.deleteTag(userId, tagId);
     return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTags, createTag, updateTag, deleteTag };
