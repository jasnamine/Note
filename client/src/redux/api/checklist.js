import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const addChecklist = createAsyncThunk(
  "checklist/addChecklist",
  async ({ noteId,title, isDone, order}, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post(`/api/v1/checklists/${noteId}`, {title, isDone, order});
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const deleteChecklistItem = createAsyncThunk(
  "collab/deleteInvitation",
  async ({ noteId, checklistId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete(`/api/v1/checklists/${noteId}/${checklistId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const updateChecklist = createAsyncThunk(
  "checklist/updateChecklist",
  async ({ noteId, checklistId, title, isDone, order },{ rejectWithValue }) => {
    try {
      const res = await axiosWrapper.patch(`/api/v1/checklists/${noteId}/${checklistId}`, { title, isDone, order });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

