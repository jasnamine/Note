const express = require("express");
const tagController = require("../controllers/tagController");
const { verifyToken } = require("../middlewares/verify");
const validate = require("../middlewares/validate");
const {
  createTagSchema,
  updateTagSchema,
  deleteTagSchema,
  getTagsSchema,
} = require("../validations/tagValidation");
const router = express.Router();
// Xem tất cả các tag đang có
router.get("/", verifyToken, validate(getTagsSchema), tagController.getTags);

// Thêm tag
router.post(
  "/",
  verifyToken,
  validate(createTagSchema),
  tagController.createTag
);

// Chỉnh sửa tag
router.patch(
  "/:tagId",
  verifyToken,
  validate(updateTagSchema),
  tagController.updateTag
);

// Xóa tag
router.delete("/:tagId", verifyToken, validate(deleteTagSchema), tagController.deleteTag);

module.exports = router;
