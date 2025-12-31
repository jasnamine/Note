import { createSlice } from "@reduxjs/toolkit";

const drawingSlice = createSlice({
  name: "drawing",
  initialState: {
    drawings: [],
  },
  reducers: {
    addDrawing: (state, action) => {
      state.drawings.push(action.payload);
    },
    clearDrawings: (state) => {
      state.drawings = [];
    },
  },
});

export const { addDrawing, clearDrawings } = drawingSlice.actions;
export default drawingSlice.reducer;
