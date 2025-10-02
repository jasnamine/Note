const express = require("express");
const historyController = require("../controllers/historyController");
const { verifyToken, restrictNoteAccess } = require("../middlewares/verify");
const router = express.Router();
const validate = require("../middlewares/validate");
const { getNoteHistorySchema } = require("../validations/historyValidation");

// Lấy danh sách các version đã chỉnh sửa của note
router.get(
  "/:noteId",
  verifyToken,
  validate(getNoteHistorySchema),
  historyController.getNoteHistory
);

module.exports = router;
