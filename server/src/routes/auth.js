const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { verifyToken } = require("../middlewares/verify");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validations/authValidation");
const passport = require("passport");
const router = express.Router();

// Đăng ký người dùng mới
router.post("/register", validate(registerSchema), authController.register);

// Đăng nhập với email/username và password
router.post("/login", validate(loginSchema), authController.login);

// Khởi tạo Google OAuth
router.get("/google", authController.googleAuth);

// Xử lý callback từ Google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleLogin
);

// Làm mới access token
router.post("/refresh-token", authController.requestRefreshToken);

// Đăng xuất
router.delete("/logout", verifyToken, authController.logout);

// Quên mật khẩu
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

// Đặt lại mật khẩu
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

module.exports = router;
