import { createSlice } from "@reduxjs/toolkit";
import { createReminder, getReminders } from "../api/remind";

const initialState = {
  listReminders: [],
  success: false,
  error: false,
  loading: false,
  msg: "",
};

const remindSlice = createSlice({
  name: "remind",
  initialState,
  reducers: {},

  // register
  extraReducers: (builder) => {
    builder
      // get reminders
      .addCase(getReminders.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = null;
      })
      .addCase(getReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.msg = action.payload;
      })
      .addCase(getReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload;
      })

      // Create remider
      .addCase(createReminder.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = null;
      })
      .addCase(createReminder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.msg = action.payload;
      })
      .addCase(createReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload;
      });
  },
});

export default remindSlice.reducer;
