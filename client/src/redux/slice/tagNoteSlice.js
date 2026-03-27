import { createSlice } from "@reduxjs/toolkit";
import { getTagsNote } from "../api/tagNote";

const initialState = {
  listTagsNote: [],
  loading: false,
  error: false,
  success: false,
  msg: "",
};

const noteSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {},

  // register
  extraReducers: (builder) => {
    // get tags
    builder
      .addCase(getTagsNote.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = "";
      })
      .addCase(getTagsNote.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.msg = action.payload.message;
        state.listTagsNote = action.payload.DT;
      })
      .addCase(getTagsNote.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload.message;
      });
  },
});

export default noteSlice.reducer;
