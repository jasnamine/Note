const express = require("express");
const collaboratorController = require("../controllers/collaboratorController");
const validate = require("../middlewares/validate");
const { verifyToken, restrictNoteAccess } = require("../middlewares/verify");
import {
  acceptCollaboratorInvitationSchema,
  addCollaboratorInvitationSchema,
  leaveNoteSchema,
  removeCollaboratorSchema,
  updateCollaboratorPermissionSchema,
} from "../validations/collaboratorValidation";
const router = express.Router();

// Lấy danh sách cộng tác viên
router.get("/:noteId", verifyToken, collaboratorController.getCollaborators);

// Chấp nhận lời mời cộng tác
router.post(
  "/accept/:invitationId",
  verifyToken,
  validate(acceptCollaboratorInvitationSchema),
  collaboratorController.acceptCollaboratorInvitation
);

// Thêm cộng tác viên
router.post(
  "/:noteId",
  verifyToken,
  restrictNoteAccess({ allowOwner: true, allowCollaborator: false }),
  validate(addCollaboratorInvitationSchema),
  collaboratorController.addCollaboratorInvitation
);

// Xóa cộng tác viên
router.delete(
  "/",
  verifyToken,
  restrictNoteAccess({ allowOwner: true, allowCollaborator: false }),
  validate(removeCollaboratorSchema),
  collaboratorController.removeCollaborator
);

// Rời khỏi note đã tham gia
router.delete(
  "/leave/:noteId",
  verifyToken,
  restrictNoteAccess({ allowOwner: false, allowCollaborator: true }),
  validate(leaveNoteSchema),
  collaboratorController.leaveNote
);

// Thay đổi quyền của collaborator
router.patch(
  "/permission",
  verifyToken,
  restrictNoteAccess({ allowOwner: true, allowCollaborator: false }),
  validate(updateCollaboratorPermissionSchema),
  collaboratorController.updateCollaboratorPermission
);

module.exports = router;
