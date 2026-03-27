import notifyService from "../services/notifyService";
require("dotenv").config();
import { StatusCodes } from "http-status-codes";

const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const response = await notifyService.deleteNotification(
      notificationId,
      userId
    );
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const response = await notifyService.getNotifications(userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const response = await notifyService.markAllNotificationsAsRead(userId);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
};
