
const express = require("express");
const { verifyToken, restrictNoteAccess } = require("../middlewares/verify");
const uploadNoteImage = require("../middlewares/uploadNoteImage");
const imageNoteController = require("../controllers/imageNoteController")

const router = express.Router();

// Upload ảnh cho 1 note
router.post(
  "/:noteId/",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: true,
    requiredPermission: "edit",
  }),
  uploadNoteImage.array("images", 15),
  imageNoteController.uploadImageNote
);

// Xóa ảnh trong 1 note
router.delete(
  "/:noteId/",
  verifyToken,
  restrictNoteAccess({
    allowOwner: true,
    allowCollaborator: true,
    requiredPermission: "edit",
  }),
  imageNoteController.deleteImageNote
);


module.exports = router;
