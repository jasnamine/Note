import {
  addColaborator,
  getCollaborators,
  removeCollaborator,
  updateCollaboratorPermission,
} from "../../api/collab";

export const collabNoteExtraReducers = (
  builder,
  handlePending,
  handleRejected
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
      state.loading = false;
      state.error = true;
      state.success = false;
      state.collab.message = action.payload;
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
      state.loading = false;
      state.error = true;
      state.success = false;
      state.collab.messageError = action.payload;
    })

    // update permisson
    .addCase(updateCollaboratorPermission.pending, handlePending)
    .addCase(updateCollaboratorPermission.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      const { collaboratorUserId, permission } = action.payload.DT;
      const collaborator = state.collab.collaborators.find(
        (c) => c.userId == collaboratorUserId
      );
      if (collaborator) {
        collaborator.permission = permission;
      }
    })
    .addCase(updateCollaboratorPermission.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.success = false;
      state.collab.messageError = action.payload;
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
          (n) => n.user.id !== collaboratorUserId
        );
      }
      state.collab.collaborators = state.collab.collaborators.filter(
        (c) => c.userId !== collaboratorUserId
      );
    })
    .addCase(removeCollaborator.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.success = false;
      state.collab.messageError = action.payload;
    });
};
