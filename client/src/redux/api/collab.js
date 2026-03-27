import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWrapper } from "./axiosWrapper";

export const getCollaborators = createAsyncThunk(
  "collab/getCollaborators",
  async ({ noteId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.get(`/api/v1/collaborators/${noteId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.EM || "Something went wrong");
    }
  }
);

export const addColaborator = createAsyncThunk(
  "collab/addColaborator",
  async ({ noteId, email, permission }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post(`/api/v1/collaborators/${noteId}`, {
        email,
        permission,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.EM || "Something went wrong");
    }
  }
);

export const acceptInvitation = createAsyncThunk(
  "collab/addColaborator",
  async ({ invitationId, inviterId, status }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.post(
        `/api/v1/collaborators/accept/${invitationId}`,
        { status, inviterId }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.EM || "Something went wrong");
    }
  }
);

export const deleteInvitation = createAsyncThunk(
  "collab/deleteInvitation",
  async ({ noteId, invitationId, inviterId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete(
        `/api/v1/collaborators/${noteId}/${invitationId}`,
        {
          data: { inviterId },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.EM || "Something went wrong");
    }
  }
);

export const updateCollaboratorPermission = createAsyncThunk(
  "collab/updateCollaboratorPermission",
  async (
    { noteId, collaboratorUserId, newPermission },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosWrapper.patch("/api/v1/collaborators/permission", {
        noteId,
        collaboratorUserId,
        newPermission,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const removeCollaborator = createAsyncThunk(
  "collab/removeCollaborator",
  async ({ noteId, collaboratorUserId }, { rejectWithValue }) => {
    try {
      const res = await axiosWrapper.delete("/api/v1/collaborators/", {
        data: {
          noteId,
          collaboratorUserId,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);
