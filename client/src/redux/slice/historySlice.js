import { createSlice } from "@reduxjs/toolkit";
import { getHistoryNote } from "../api/historyNote";

const initialState = {
  historyNote: [],
  loading: false,
  error: false,
  success: false,
  msg: "",
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},

  // register
  extraReducers: (builder) => {
    // get historyNote
    builder
      .addCase(getHistoryNote.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = "";
      })
      .addCase(getHistoryNote.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.msg = action.payload.message;
        state.historyNote = action.payload.DT;
      })
      .addCase(getHistoryNote.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload.message;
      });
  },
});

export default historySlice.reducer;
