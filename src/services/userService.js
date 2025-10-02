const db = require("../models");
const CustomError = require("../ultities/CustomError");
import { StatusCodes } from "http-status-codes";

const getUser = async (id) => {
  try {
    const user = await db.User.findOne({
      where: { id: id },
      raw: true,
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }

    return {
      statusCode: StatusCodes.OK,
      message: "User retrieved successfully",
      DT: user,
    };
  } catch (error) {
    throw error;
  }
};

const editUser = async (userData, userId) => {
  try {
    let user = await db.User.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }

    const updateFields = {};

    if (userData.fullname) {
      updateFields.fullname = userData.fullname;
    }

    if (userData.avatar) {
      updateFields.avatar = userData.avatar;
    }

    if (Object.keys(updateFields).length === 0) {
      throw new CustomError(
        "No valid fields to update",
        StatusCodes.BAD_REQUEST
      );
    }

    await db.User.update(updateFields, { where: { id: userId } });

    const newProfile = await db.User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Edit profile successfully",
      DT: newProfile,
    };
  } catch (error) {
    throw error;
  }
};

const updateUserSettings = async (userId, newSettings) => {
  try {
    const validLanguages = ["en", "vi"];
    const validThemes = ["light", "dark"];

    const user = await db.User.findByPk(userId);
    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }

    const currentSettings = user.settings || {};
    const updatedSettings = { ...currentSettings };

    if ("language" in newSettings) {
      if (!validLanguages.includes(newSettings.language)) {
        throw new CustomError(
          "User not Invalid language setting",
          StatusCodes.NOT_FOUND
        );
      }
      updatedSettings.language = newSettings.language;
    }

    if ("theme" in newSettings) {
      if (!validThemes.includes(newSettings.theme)) {
        throw new CustomError("Invalid theme setting", StatusCodes.NOT_FOUND);
      }
      updatedSettings.theme = newSettings.theme;
    }

    user.settings = updatedSettings;
    await user.save();

    const newUser = await db.User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Settings updated successfully",
      DT: newUser,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { getUser, editUser, updateUserSettings };
