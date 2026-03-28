const bcrypt = require("bcryptjs");
const client = require("../config/connectRedis");
const db = require("../models");
const { sendResetPasswordEmail } = require("../ultities/email");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../ultities/functions");
const CustomError = require("../ultities/CustomError");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const crypto = require("crypto");

const register = async (userData) => {
  try {
    let user = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { username: userData.username },
          { email: userData.email },
        ],
      },
    });

    if (user) {
      throw new CustomError(
        user.username === userData.username
          ? "Username already exists"
          : "Email already exists",
        StatusCodes.BAD_REQUEST
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashUserPassword = bcrypt.hashSync(userData.password, salt);
    let newUser = await db.User.create({
      username: userData.username,
      fullname: userData.fullname,
      email: userData.email,
      fullname: userData.fullname,
      settings: { language: "en", theme: "light" },
      password: hashUserPassword,
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Register successfully",
      DT: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
      },
    };
  } catch (error) {
    throw error;
  }
};

const login = async (userData, res) => {
  try {
    const conditions = [];
    if (userData.username) {
      conditions.push({ username: userData.username });
    }

    if (userData.email) {
      conditions.push({ email: userData.email });
    }

    if (conditions.length === 0) {
      throw new CustomError(
        "Missing email or username",
        StatusCodes.BAD_REQUEST
      );
    }

    let user = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: conditions,
      },
    });

    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }

    const validPassword = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!validPassword) {
      throw new CustomError("Incorrect password", StatusCodes.UNAUTHORIZED);
    }

    if (user && validPassword) {
      const accessToken = await signAccessToken(user);
      const refreshToken = await signRefreshToken(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return {
        statusCode: StatusCodes.OK,
        message: "Login successfully",
        DT: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
          accessToken: accessToken,
        },
      };
    }
  } catch (error) {
    throw error;
  }
};

const googleLogin = async (user, res) => {
  try {
    // Nhận user từ passport
    if (!user) {
      throw new CustomError(
        "Google authentication failed",
        StatusCodes.UNAUTHORIZED
      );
    }

    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Google login successfully",
      DT: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        accessToken,
      },
    };
  } catch (error) {
    throw error;
  }
};

const requestRefreshToken = async (refreshToken, res) => {
  try {
    const payload = await verifyRefreshToken(refreshToken);
    const newAccessToken = await signAccessToken(payload);
    const newRefreshToken = await signRefreshToken(payload);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Request refresh token successfully",
      DT: {
        accessToken: newAccessToken,
      },
    };
  } catch (error) {
    throw error;
  }
};

const logout = async (refreshToken, res) => {
  try {
    const payload = await verifyRefreshToken(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    await client.del(payload.id.toString(), (err, reply) => {
      if (err) {
        throw new CustomError("Token is not valid", StatusCodes.UNAUTHORIZED);
      }
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Log out successfully",
    };
  } catch (error) {
    throw error;
  }
};

const forgotPassword = async (email) => {
  try {
    let user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      throw new CustomError("Email not found", StatusCodes.NOT_FOUND);
    }

    if (user.googleId && !user.password) {
      throw new CustomError(
        "Account registered via Google, use Google login",
        StatusCodes.BAD_REQUEST
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    const emailResult = await sendResetPasswordEmail(email, resetToken);
    if (!emailResult.success) {
      throw new CustomError(
        "Failed to send email",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return {
      statusCode: StatusCodes.OK,
      message: "Reset password email sent",
      DT: {},
    };
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    let user = await db.User.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: { [db.Sequelize.Op.gt]: Date.now() },
      },
    });

    if (!user) {
      throw new CustomError(
        "Invalid or expired token",
        StatusCodes.BAD_REQUEST
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.User.update(
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
      {
        where: { id: user.id },
      }
    );

    return {
      statusCode: StatusCodes.OK,
      message: "Password reset successfully",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  requestRefreshToken,
  logout,
  forgotPassword,
  resetPassword,
};
