import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const uploadImageNote = createAsyncThunk(
  "images/uploadImageNote",
  async ({ noteId, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post(`/api/v1/images/${noteId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload image"
      );
    }
  }
);

export const deleteImageNote = createAsyncThunk(
  "images/deleteImage",
  async ({ noteId, imageUrl }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete(`/api/v1/images/${noteId}/`, {
        data: { imageUrl },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);
