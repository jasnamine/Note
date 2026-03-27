const db = require("../models");
const CustomError = require("../ultities/CustomError");
require("dotenv").config();
import { StatusCodes } from "http-status-codes";

const deleteNotification = async (notificationId, userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw CustomError("User is not found in system", StatusCodes.NOT_FOUND);
    }

    const notification = await db.Notification.findOne({
      where: { id: notificationId, userID: userId },
    });

    await notification.destroy();

    return {
      statusCode: StatusCodes.OK,
      message: "Delete notification successfully",
      DT: { id: notificationId },
    };
  } catch (error) {
    throw error;
  }
};

const getNotifications = async (userId) => {
  try {
    const notifications = await db.Notification.findAll({
      where: { userID: userId },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Notifications retrieved successfully",
      DT: notifications,
    };
  } catch (error) {
    throw error;
  }
};

const markAllNotificationsAsRead = async (userId) => {
  try {
    await db.Notification.update(
      { isRead: true },
      { where: { userID: userId, isRead: false } }
    );

    return {
      statusCode: StatusCodes.OK,
      message: "All notifications marked as read",
    };
  } catch (error) {
    throw error;
  }
};


module.exports = {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
};
