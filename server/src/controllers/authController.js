const { StatusCodes } = require("http-status-codes");
const authService = require("../services/authService");
const passport = require("passport");
const CustomError = require("../ultities/CustomError");
require("dotenv").config();
const register = async (req, res, next) => {
  try {
    const response = await authService.register(req.body);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const response = await authService.login(req.body, res);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const googleAuth = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

const googleLogin = async (req, res, next) => {
  try {
    const response = await authService.googleLogin(req.user, res);
    if (response.EC === 0) {
      const redirectUrl = `${process.env.REACT_URL}/google-login-success?accessToken=${response.DT.accessToken}&id=${response.DT.id}&username=${response.DT.username}&email=${response.DT.email}&fullname=${response.DT.fullname}`;
      return res.redirect(redirectUrl);
    }
    return res.status(StatusCodes.UNAUTHORIZED).json(response);
  } catch (error) {
    next(error);
  }
};

const requestRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new CustomError(
        "No refresh token provided",
        StatusCodes.BAD_REQUEST,
      );
    }

    const response = await authService.requestRefreshToken(refreshToken, res);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new CustomError(
        "No refresh token provided",
        StatusCodes.BAD_REQUEST,
      );
    }

    const response = await authService.logout(refreshToken, res);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await authService.forgotPassword(email);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const response = await authService.resetPassword(token, newPassword);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  googleAuth,
  googleLogin,
  login,
  requestRefreshToken,
  logout,
  forgotPassword,
  resetPassword,
};
