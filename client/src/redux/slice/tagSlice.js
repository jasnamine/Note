import { createSlice } from "@reduxjs/toolkit";
import { createTag, deleteTag, editTag, getTags } from "../api/tag";

const initialState = {
  listTags: [],
  loading: false,
  error: false,
  success: false,
  msg: "",
};

const noteSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // get tags
    builder
      .addCase(getTags.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = "";
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.msg = action.payload.message;
        state.listTags = action.payload.DT;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload.message;
      })

      // createTag
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = "";
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.msg = action.payload.message;
        state.listTags = [...state.listTags, action.payload.DT];
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload.message;
      })

      // editTag
      .addCase(editTag.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = "";
      })
      .addCase(editTag.fulfilled, (state, action) => {
        const updated = action.payload.DT;
        const idx = state.listTags.findIndex((tag) => tag.id === updated.id);
        if (idx !== -1) state.listTags[idx] = updated;
        state.loading = false;
        state.success = true;
        state.msg = action.payload.message;
      })

      .addCase(editTag.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload.message;
      })

      // deleteTag
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.msg = "";
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.listTags = state.listTags.filter((tag) => tag.id !== deletedId);
        state.loading = false;
        state.success = true;
        state.msg = action.payload.message;
      })

      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.msg = action.payload.message;
      });
  },
});

export default noteSlice.reducer;
