const express = require("express");
const notifyController = require("../controllers/notifyController");
const validate = require("../middlewares/validate");
const { verifyToken } = require("../middlewares/verify");
const { deleteNotificationSchema, markAllNotificationsAsReadSchema, getNotificationsSchema } = require("../validations/notifyValidation");
const router = express.Router();

// Lấy thông báo của người dùng
router.get("/", verifyToken, validate(getNotificationsSchema), notifyController.getNotifications);

// xóa thông báo
router.delete(
  "/:notificationId",
  verifyToken,
  validate(deleteNotificationSchema),
  notifyController.deleteNotification
);

// Đánh dấu là đã đọc thông báo
router.patch(
  "/read",
  verifyToken,
  validate(markAllNotificationsAsReadSchema),
  notifyController.markAllNotificationsAsRead
);

module.exports = router;
