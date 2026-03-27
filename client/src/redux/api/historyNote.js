import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const getHistoryNote = createAsyncThunk(
  "history/getHistoryNote",
  async ({ noteId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get(`/api/v1/histories/${noteId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);
