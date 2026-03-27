import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const getTagsNote = createAsyncThunk(
  "tagNote/getTagsNote",
  async (noteId, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get(`/api/v1/noteTags/${noteId}`);
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const addTagToNote = createAsyncThunk(
  "tagNote/addTagToNote",
  async ({ noteId, tagId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post("/api/v1/noteTags/", {
        noteId,
        tagId,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const addMultipleTags = createAsyncThunk(
  "tagNote/addMultipleTags",
  async ({ noteId, tagIDs }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post("/api/v1/noteTags/bulk", {
        noteId,
        tagIDs,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const removeTagNote = createAsyncThunk(
  "tagNote/removeTagNote",
  async ({ noteId, tagId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete("/api/v1/noteTags/", {
        data: { noteId, tagId },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);
