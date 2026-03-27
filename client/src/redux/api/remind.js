import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const getReminders = createAsyncThunk(
  "remind/getReminders",
  async (noteId, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post("/api/v1/reminders", {
        params: noteId,
      });
      console.log("API response", res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.EM || "Something went wrong");
    }
  }
);

export const createReminder = createAsyncThunk(
  "remind/createReminder",
  async ({ noteId, time, repeat }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post(`/api/v1/reminders/${noteId}`, {
        time,
        repeat,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.EM || "Something went wrong"
      );
    }
  }
);

export const createMultipleReminders = createAsyncThunk(
  "remind/createMultipleReminders",
  async ({ noteId, reminders }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post("/api/v1/reminders/bulk", {
        noteId,
        reminders,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const editReminder = createAsyncThunk(
  "remind/editReminder",
  async ({ id, noteId, time, repeat }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.patch(`/api/v1/reminders/${id}/${noteId}`, {
        time,
        repeat,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const deleteReminder = createAsyncThunk(
  "remind/deleteReminder",
  async ({ id, noteId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete(
        `/api/v1/reminders/${id}/${noteId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
