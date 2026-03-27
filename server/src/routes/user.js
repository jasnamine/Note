const express = require("express");
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/verify");
const validate = require("../middlewares/validate");
const upload = require("../middlewares/uploadAvt");
const { editUserSchema, updateUserSettingsSchema, getUserSChema } = require("../validations/userValidation");

const router = express.Router();
// Lấy thông tin user
router.get("/", verifyToken, validate(getUserSChema), userController.getUser);

// Chỉnh sửa thông tin user
router.patch("/edit", verifyToken, validate(editUserSchema), upload.single("avatar"), userController.editUser);

// Chỉnh sửa seetings giao diện của user
router.patch("/settings", verifyToken, validate(updateUserSettingsSchema), userController.updateUserSettings);

module.exports = router;
