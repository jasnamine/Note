import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const getNotes = createAsyncThunk(
  "note/getNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get("/api/v1/notes");
      console.log("API response", res.data);
      return res.data;
    } catch (err) {
      console.log("debug: ", err);
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const getNotesByTag = createAsyncThunk(
  "note/getNotesByTag",
  async ({tagId}, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get(`/api/v1/notes/${tagId}`);
      console.log("API response", res.data);
      return res.data;
    } catch (err) {
      console.log("debug: ", err);
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const getPinnedNotes = createAsyncThunk(
  "note/getPinnedNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get("/api/v1/notes/pin");
      console.log("API response", res.data);
      return res.data;
    } catch (err) {
      console.log("debug: ", err);
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const getArchivedNotes = createAsyncThunk(
  "note/getArchivedNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get("/api/v1/notes/archive");
      return res.data;
    } catch (err) {
      console.log("debug: ", err);
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const getCollabNotes = createAsyncThunk(
  "note/getCollabNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get("/api/v1/notes/collab");
      console.log("API response", res.data);
      return res.data;
    } catch (err) {
      console.log("debug: ", err);
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const addNote = createAsyncThunk(
  "note/addNote",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post("/api/v1/notes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const editNote = createAsyncThunk(
  "note/editNote",
  async (
    { noteId, title, content, type, checklistItems },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosWrapper.patch(`/api/v1/notes/edit/${noteId}`, {
        title,
        content,
        type,
        checklistItems,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.EM || "Something went wrong"
      );
    }
  }
);

export const pinNote = createAsyncThunk(
  "note/pinNote",
  async ({ noteId, isPinned }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.patch(`/api/v1/notes/pin/${noteId}`, {
        isPinned,
      });
      return res.data;
    } catch (err) {
      console.log("debug: ", err);
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const archivedNote = createAsyncThunk(
  "note/archivedNote",
  async ({ noteId, isArchived }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.patch(`/api/v1/notes/archive/${noteId}`, {
        isArchived,
      });
      return res.data;
    } catch (err) {
      console.log("debug: ", err);
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const searchNote = createAsyncThunk(
  "note/searchNote",
  async (keyword, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get("/api/v1/notes/search", {
        params: keyword,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const softDeleteNote = createAsyncThunk(
  "note/softDeleteNote",
  async ({ noteId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete(
        `/api/v1/notes/soft-delete/${noteId}`,
        {
          noteId,
        }
      );
      return res.data;
    } catch (err) {
      console.log("debug: ", err);
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const restoreNote = createAsyncThunk(
  "note/restoreNote",
  async ({ noteId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.patch(`/api/v1/notes/restore/${noteId}`, {
        param: noteId,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const deleteNote = createAsyncThunk(
  "note/deleteNote",
  async ({ noteId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete(`/api/v1/notes/delete/${noteId}`, {
        param: noteId,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const getDeletedNotes = createAsyncThunk(
  "note/getDeletedNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get("/api/v1/notes/trash-can");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const settingNote = createAsyncThunk(
  "note/settingNote",
  async ({ noteId, color, theme }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.patch(
        `/api/v1/notes/setting/${noteId}`,

        { color, theme }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);
