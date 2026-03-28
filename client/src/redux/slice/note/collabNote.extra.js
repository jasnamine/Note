import {
  addColaborator,
  getCollaborators,
  leaveNote,
  removeCollaborator,
  updateCollaboratorPermission,
} from "../../api/collab";

export const collabNoteExtraReducers = (
  builder,
  handlePending,
  handleRejected,
) => {
  builder
    // get collaborators
    .addCase(getCollaborators.pending, handlePending)
    .addCase(getCollaborators.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.collab.collaborators = action.payload.DT;
      state.message = action.payload.EM;
    })
    .addCase(getCollaborators.rejected, (state, action) => {
      handleRejected(state, action, "Failed to get Collaborators");
    })

    // add collab
    .addCase(addColaborator.pending, handlePending)
    .addCase(addColaborator.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.collab.messageSuccess = action.payload.EM;
    })

    .addCase(addColaborator.rejected, (state, action) => {
      handleRejected(state, action, "Failed to add Colaborator");
    })

    // update permisson
    .addCase(updateCollaboratorPermission.pending, handlePending)
    .addCase(updateCollaboratorPermission.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      const { collaboratorUserId, permission } = action.payload.DT;
      const collaborator = state.collab.collaborators.find(
        (c) => c.userId == collaboratorUserId,
      );
      if (collaborator) {
        collaborator.permission = permission;
      }
    })
    .addCase(updateCollaboratorPermission.rejected, (state, action) => {
      handleRejected(state, action, "Failed to update Collaborator Permission");
    })

    // remove collaborator
    .addCase(removeCollaborator.pending, handlePending)
    .addCase(removeCollaborator.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;

      const { collaboratorUserId, noteId } = action.payload.DT;
      const note = state.listNotes.find((n) => n.id == noteId);
      console.log(note);
      if (note) {
        note.collaborators = note.collaborators.filter(
          (n) => n.user.id !== collaboratorUserId,
        );
      }
      state.collab.collaborators = state.collab.collaborators.filter(
        (c) => c.userId !== collaboratorUserId,
      );
    })
    .addCase(removeCollaborator.rejected, (state, action) => {
      handleRejected(state, action, "Failed to remove Collaborator");
    })

    .addCase(leaveNote.pending, handlePending)
    .addCase(leaveNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;

      const leftNoteId = action.payload?.noteId || action.payload?.DT?.noteId;

      if (leftNoteId) {
        const filterNote = (list) =>
          list ? list.filter((n) => n.id != leftNoteId) : [];

        state.listNotes = filterNote(state.listNotes);
        state.pinnedNotes = filterNote(state.pinnedNotes);
        state.otherNotes = filterNote(state.otherNotes);
        state.archivedNotes = filterNote(state.archivedNotes);
        state.listNotesByTag = filterNote(state.listNotesByTag);

        if (state.collabNotes) {
          state.collabNotes = state.collabNotes.filter(
            (c) => (c.noteID || c.id) != leftNoteId,
          );
        }

        if (state.note?.id == leftNoteId) {
          state.note = null;
        }
      }

      state.collab.collaborators = [];
      state.collab.messageSuccess =
        action.payload.message || "Left successfully";
    })
    .addCase(leaveNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to leave note");
    });
};
