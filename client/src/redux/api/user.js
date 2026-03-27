import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get("/api/v1/user/");
      return res.data;
    } catch (err) {

      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const editUser = createAsyncThunk(
  "user/editUser",
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("fullname", userData.fullname);
      if (userData.avatar) {
        formData.append("avatar", userData.avatar);
      }

      const res = await axiosWrapper.patch("/api/v1/user/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res.data)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");

    }
  }
);

export const updateSettings = createAsyncThunk(
  "user/updateSettings",
  async (setting, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.patch("/api/v1/user/settings", setting);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

