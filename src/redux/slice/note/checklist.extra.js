import { addChecklist, deleteChecklistItem, updateChecklist } from "../../api/checklist";


export const checklistExtraReducers = (builder, handlePending, handleRejected) => {
  builder
    // add checklist to note
    .addCase(addChecklist.pending, handlePending)
    .addCase(addChecklist.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.message;
    })
    .addCase(addChecklist.rejected, (state, action) => {
      handleRejected(state, action, "Failed to add checklist to note");
    })

    // edit checklist item
    .addCase(updateChecklist.pending, handlePending)
    .addCase(updateChecklist.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.message;
    })
    .addCase(updateChecklist.rejected, (state, action) => {
      handleRejected(state, action, "Failed to edit checklist item");
    })

    // delete checklist item
    .addCase(deleteChecklistItem.pending, handlePending)
    .addCase(deleteChecklistItem.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.message;
    })
    .addCase(deleteChecklistItem.rejected, (state, action) => {
      handleRejected(state, action, "Failed to delete checklist item");
    });
};
