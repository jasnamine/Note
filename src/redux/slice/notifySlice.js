import { createSlice } from "@reduxjs/toolkit";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
} from "../api/notify";

const initialState = {
  notifications: [],
  loading: false,
  success: true,
  error: false,
  message: "",
};

const notifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get notifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.message = "";
      })

      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.notifications = action.payload.DT;
        state.error = false;
        state.message = action.payload.message;
      })

      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.message = action.payload.message;
      })

      // delete noti
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.message = "";
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { id } = action.payload.DT;
        const notification = state.notifications.find((n) => n.id == id);
        if (notification) {
          state.notifications = state.notifications.filter((n) => n.id != id);
        }
        state.error = false;
        state.message = action.payload.message;
      })

      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.message = action.payload.message;
      })

      // mark
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
        state.message = "";
      })

      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.message = action.payload.message;
      })

      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.message = action.payload.message;
      });
  },
});

export default notifySlice.reducer;
