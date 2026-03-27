import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const getNotifications = createAsyncThunk(
  "notify/getNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get("/api/v1/notifications");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.EM || "Something went wrong");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notify/deleteNotification",
  async ({ notificationId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete(
        `/api/v1/notifications/${notificationId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notify/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.patch("/api/v1/notifications/read");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);
