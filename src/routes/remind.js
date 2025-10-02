const express = require("express");
const remindController = require("../controllers/remindController");
const { verifyToken, restrictNoteAccess } = require("../middlewares/verify");
const validate = require("../middlewares/validate");
const {
  createReminderSchema,
  updateReminderSchema,
  createMultipleRemindersSchema,
  deleteReminderSchema,
} = require("../validations/remindValidation");
const router = express.Router();

// Tạo nhiều nhắc nhở
router.post(
  "/bulk",
  verifyToken,
  validate(createMultipleRemindersSchema),
  remindController.createMultipleReminders
);

// Tạo thêm nhắc nhở
router.post(
  "/:noteId",
  verifyToken,
  restrictNoteAccess({ allowOwner: true, allowCollaborator: true, requiredPermission: "edit" }),
  validate(createReminderSchema),
  remindController.createReminder
);

// Chỉnh sửa nhắc nhở
router.patch(
  "/:id/:noteId",
  verifyToken,
  restrictNoteAccess({ allowOwner: true, allowCollaborator: true, requiredPermission: "edit" }),
  validate(updateReminderSchema),
  remindController.updateReminder
);

// Xóa nhắc nhở
router.delete(
  "/:id/:noteId",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: true,
    requiredPermission: "edit",
  }),
  validate(deleteReminderSchema),
  remindController.deleteReminder
);

module.exports = router;
