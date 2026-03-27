import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const getTags = createAsyncThunk(
  "tag/getTags",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get("/api/v1/tags/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const createTag = createAsyncThunk(
  "tag/createTag",
  async (name, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post("/api/v1/tags/", { name });
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.EM || "Something went wrong");
    }
  }
);

export const editTag = createAsyncThunk(
  "tag/editTag",
  async ({ tagId, tagName }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.patch(`/api/v1/tags/${tagId}`, {
        tagId,
        tagName,
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.EM || "Something went wrong");
    }
  }
);

export const deleteTag = createAsyncThunk(
  "tag/deleteTag",
  async (tagId, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete(`/api/v1/tags/${tagId}`, {
        tagId,
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

