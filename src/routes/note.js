const express = require("express");
const noteController = require("../controllers/noteController");
const { verifyToken, restrictNoteAccess } = require("../middlewares/verify");
const validate = require("../middlewares/validate");
const {
  addNoteSchema,
  editNoteSchema,
  searchNotesSchema,
  settingNoteSchema,
  deleteNoteSchema,
  pinNoteSchema,
  restoreNoteSchema,
  softDeleteSchema,
  getNotesSchema,
  getPinnedNotesSchema,
  getCollabNotesSchema,
  getDeletedNotesSchema,
  getArchivedNotesSchema,
  getNotesByTagSchema,
} = require("../validations/noteValidation");
const uploadNoteImage = require("../middlewares/uploadNoteImage");
const router = express.Router();

// Lấy danh sách note (không pin)
router.get("/", verifyToken, validate(getNotesSchema), noteController.getNotes);

// Lấy danh sách note archive
router.get(
  "/trash-can",
  verifyToken,
  validate(getDeletedNotesSchema),
  noteController.getDeletedNotes
);

// Lấy danh sách note được pin
router.get(
  "/pin",
  verifyToken,
  validate(getPinnedNotesSchema),
  noteController.getPinnedNotes
);

// Lấy danh sách note cộng tác
router.get(
  "/collab",
  verifyToken,
  validate(getCollabNotesSchema),
  noteController.getCollabNotes
);

// Lấy danh sách note archive
router.get(
  "/archive",
  verifyToken,
  validate(getArchivedNotesSchema),
  noteController.getArchivedNotes
);

// Thêm note
router.post(
  "/",
  verifyToken,
  uploadNoteImage.array("images", 15),
  validate(addNoteSchema),
  noteController.addNote
);

// Lấy danh sách note theo tag
router.get("/:tagId", verifyToken, validate(getNotesByTagSchema), noteController.getNotesByTag);

// Tìm kiếm note
router.get(
  "/search",
  verifyToken,
  validate(searchNotesSchema),
  noteController.searchNotes
);

// Chỉnh sửa note
router.patch(
  "/edit/:noteId",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: true,
    requiredPermission: "edit",
  }),
  validate(editNoteSchema),
  noteController.editNote
);

// Lấy note theo ID
router.get(
  "/:id",
  verifyToken,
  restrictNoteAccess({ allowOwner: true, allowCollaborator: true }),
  noteController.getNoteById
);

// Soft delete note
router.delete(
  "/soft-delete/:noteId",
  verifyToken,
  restrictNoteAccess({ allowOwner: true, allowCollaborator: false }),
  validate(softDeleteSchema),
  noteController.softDelete
);

// Restore note
router.patch(
  "/restore/:noteId",
  verifyToken,
  restrictNoteAccess({ allowOwner: true, allowCollaborator: false }),
  validate(restoreNoteSchema),
  noteController.restoreNote
);

// Setting note
router.patch(
  "/setting/:noteId",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: false,
    requiredPermission: "edit",
  }),
  validate(settingNoteSchema),
  noteController.settingNote
);

// Xóa vĩnh viễn note
router.delete(
  "/delete/:noteId",
  verifyToken,
  restrictNoteAccess({ allowOwner: true, allowCollaborator: false }),
  validate(deleteNoteSchema),
  noteController.deleteNote
);

// Ghim note
router.patch(
  "/pin/:noteId",
  verifyToken,
  validate(pinNoteSchema),
  noteController.pinNote
);

// Archive note
router.patch("/archive/:noteId", verifyToken, noteController.archivedNote);
module.exports = router;
