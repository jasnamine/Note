import { deleteImageNote, uploadImageNote } from "../../api/imageNote";
export const imageNoteExtraReducers = (
  builder,
  handlePending,
  handleRejected
) => {
  builder
    // Upload image to note
    .addCase(uploadImageNote.pending, handlePending)
    .addCase(uploadImageNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const { noteID } = action.payload.DT[0];
      const note = state.listNotes.find((n) => n.id == noteID);
      const collabNote = state.collabNotes.find((c) => c.noteID == noteID);
      const pinnedNote = state.pinnedNotes.find((p) => p.id == noteID);
      const archivedNote = state.archivedNotes.find((a) => a.id == noteID);
      const noteByTag = state.listNotesByTag.find((t) => t.id == noteID);
      const newImages = action.payload.DT.map((img) => ({
        id: img.id,
        url: img.url,
        type: "image",
      }));
      if (note) {
        note.images = [...(note.images || []), ...newImages];
      }
      if (collabNote) {
        collabNote.note.images = [
          ...(collabNote.note.images || []),
          ...newImages,
        ];
      }
      if (pinnedNote) {
        pinnedNote.images = [...(pinnedNote.images || []), ...newImages];
      }

      if (archivedNote) {
        archivedNote.images = [...(archivedNote.images || []), ...newImages];
      }

      if (noteByTag) {
        noteByTag.images = [...(noteByTag.images || []), ...newImages];
      }
    })
    .addCase(uploadImageNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to upload img to note");
    })

    // Delete image from note
    .addCase(deleteImageNote.pending, handlePending)
    .addCase(deleteImageNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const { noteId, imageUrl } = action.meta.arg;
      const note = state.listNotes.find((n) => n.id == noteId);
      const collabNote = state.collabNotes.find((c) => c.noteID == noteId);
      const pinnedNote = state.pinnedNotes.find((p) => p.id == noteId);
      const archivedNote = state.archivedNotes.find((a) => a.id == noteId);
      const noteByTag = state.listNotesByTag.find((t) => t.id == noteId);
      if (note) {
        note.images = note.images.filter((img) => img.url !== imageUrl);
      }
      if (collabNote) {
        collabNote.note.images = collabNote.note.images.filter(
          (img) => img.url !== imageUrl
        );
      }
      if (pinnedNote) {
        pinnedNote.images = pinnedNote.images.filter(
          (img) => img.url !== imageUrl
        );
      }
      if (archivedNote) {
        archivedNote.images = archivedNote.images.filter(
          (img) => img.url !== imageUrl
        );
      }
      if (noteByTag) {
        noteByTag.images = noteByTag.images.filter(
          (img) => img.url !== imageUrl
        );
      }
    })
    .addCase(deleteImageNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to delete img note");
    });
};
