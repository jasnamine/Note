const userService = require("../services/userService");
const { StatusCodes } = require("http-status-codes");

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await userService.getUser(userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    let { fullname } = req.body;

    let avatar = req.file?.path;

    let userId = req.user.id;

    const response = await userService.editUser({ fullname, avatar }, userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;

    const response = await userService.updateUserSettings(userId, settings);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  editUser,
  updateUserSettings,
};
