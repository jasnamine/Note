import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post("/api/v1/auth/register", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post("/api/v1/auth/login", userData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const googleLogin = createAsyncThunk(
  "/auth/googleLogin",
  async ({ accessToken, id }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get(
        "/api/v1/auth/google/callback",
        { accessToken, id },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(err.response?.data?.EM || "Something went wrong");
    }
  }
);

export const requestRefreshToken = createAsyncThunk(
  "auth/refreshToken",
  async ({ rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post(
        "/api/v1/auth/refresh-token",
        {},
        {
          withCredentials: true,
        }
      );
      setAccessToken(res.data.DT.accessToken); 
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh token"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete("/api/v1/auth/logout", {
        withCredentials: true, 
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post("/api/v1/auth/forgot-password", {
        email,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset email"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post("/api/v1/auth/reset-password", {
        token,
        newPassword,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reset password"
      );
    }
  }
);
