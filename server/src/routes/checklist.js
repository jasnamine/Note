const express = require("express");
const checklistController = require("../controllers/checklistController");
const { verifyToken, restrictNoteAccess } = require("../middlewares/verify");
const validate = require("../middlewares/validate");
const { addChecklistItemSchema, updateChecklistItemSchema } = require("../validations/checklistValidation");
const router = express.Router();
// Thêm checklist item
router.post( "/:noteId",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: true,
    requiredPermission: "edit",
  }),
  validate(addChecklistItemSchema),
  checklistController.addChecklistItem
);

// Lấy checklist
router.get(
  "/:noteId",
  verifyToken,
  checklistController.getChecklist
);

// Chỉnh sửa checklist item
router.patch(
  "/:noteId/:checklistId",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: true,
    requiredPermission: "edit",
  }),
  validate(updateChecklistItemSchema),
  checklistController.updateChecklistItem
);

// Xóa checklist item
router.delete(
  "/:noteId/:checklistId",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: true,
    requiredPermission: "edit",
  }),
  checklistController.deleteChecklistItem
);
module.exports = router;
