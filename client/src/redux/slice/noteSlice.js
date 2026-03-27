import { createSlice } from "@reduxjs/toolkit";
import { checklistExtraReducers } from "./note/checklist.extra";
import { collabNoteExtraReducers } from "./note/collabNote.extra";
import { imageNoteExtraReducers } from "./note/imageNote.extra";
import { noteExtraReducers } from "./note/note.extra";
import { remindExtraReducers } from "./note/remind.extra";
import { tagNoteExtraReducers } from "./note/tagNote.extra";

const initialState = {
  listNotes: [],
  deleteNotes: [],
  archivedNotes: [],
  pinnedNotes: [],
  collabNotes: [],
  listNotesByTag: [],
  loading: false,
  error: false,
  success: false,
  message: "",
  collab: {
    collaborators: [],
    messageError: "",
    messageSuccess: "",
  },
};

const handlePending = (state) => {
  state.loading = true;
  state.error = false;
  state.success = false;
  state.message = "";
};

const handleRejected = (state, action, defaultMessage) => {
  state.loading = false;
  state.error = true;
  state.success = false;
  state.success = state.message = action.payload || defaultMessage;
};

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    clearCollabMessages: (state) => {
      state.collab.messageError = "";
      state.collab.messageSuccess = "";
    },
  },
  extraReducers: (builder) => {
    noteExtraReducers(builder, handlePending, handleRejected);
    tagNoteExtraReducers(builder, handlePending, handleRejected);
    remindExtraReducers(builder, handlePending, handleRejected);
    imageNoteExtraReducers(builder, handlePending, handleRejected);
    collabNoteExtraReducers(builder, handlePending, handleRejected);
    checklistExtraReducers(builder, handlePending, handleRejected);
  },
});

export default noteSlice.reducer;
export const { clearCollabMessages } = noteSlice.actions;
