import { createSlice } from "@reduxjs/toolkit";
import { editUser, getUser, updateSettings } from "../api/user";

const initialState = {
  userData: [],
  loading: false,
  success: false,
  error: false,
  msg: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // get user
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = "";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.msg = action.payload.message;
        state.userData = action.payload.DT;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload.message;
      })

      // edit user
      .addCase(editUser.pending, (state, action) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = "";
      })

      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.msg = action.payload.message;
        state.userData = action.payload.DT;
      })

      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload.message;
      })

      // update settings
      .addCase(updateSettings.pending, (state, action) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = "";
      })

      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.msg = action.payload.message;
        state.userData = action.payload.DT;
      })

      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload.message;
      });
  },
});

export default userSlice.reducer;
