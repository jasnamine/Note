const express = require("express");
const noteTagController = require("../controllers/noteTagController");
const { verifyToken, restrictNoteAccess } = require("../middlewares/verify");
const validate = require("../middlewares/validate");
const {
  addTagToNoteSchema,
  addMultipleTagsSchema,
  removeTagNoteSchema,
  getTagsOfNoteSchema,
} = require("../validations/noteTagValidation");
const router = express.Router();

// Thêm 1 tag vào note
router.post(
  "/",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: false,
  }),
  validate(addTagToNoteSchema),
  noteTagController.addTagToNote
);

// Thêm nhiều tag vào note
router.post(
  "/bulk",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: false,
  }),
  validate(addMultipleTagsSchema),
  noteTagController.addMultipleTags
);

// Xóa tag khỏi note
router.delete(
  "/",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: false,
  }),
  validate(removeTagNoteSchema),
  noteTagController.removeTagNote
);

// Xem các tag có trong note
router.get(
  "/:noteId",
  verifyToken,
  validate(getTagsOfNoteSchema),
  noteTagController.getTagsOfNote
);

module.exports = router;
