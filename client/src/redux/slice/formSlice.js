import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  content: "",
  color: "Default",
  theme: "Default",
  checklistItems: [{ id: "", title: "", isDone: false }],
  images: [],
  tags: [],
  reminders: [],
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      return { ...state, ...action.payload };
    },
    addImage: (state, action) => {
      state.images.push(action.payload);
    },
    resetForm: () => initialState,
  },
});

export const { setFormData, addImage, resetForm } = formSlice.actions;
export default formSlice.reducer;
