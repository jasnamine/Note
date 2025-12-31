import {
  addMultipleTags,
  addTagToNote,
  getTagsNote,
  removeTagNote,
} from "../../api/tagNote";

export const tagNoteExtraReducers = (
  builder,
  handlePending,
  handleRejected
) => {
  builder
    // Get tags for a note
    .addCase(getTagsNote.pending, handlePending)
    .addCase(getTagsNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.message;
      const noteId = action.meta.arg;
      const note = state.listNotes.find((n) => n.id === noteId);
      if (note) {
        note.tags = action.payload.DT || [];
      }
    })
    .addCase(getTagsNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to get tags for a note");
    })

    // Add tag to note
    .addCase(addTagToNote.pending, handlePending)
    .addCase(addTagToNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.message;
      const { noteId, tagId } = action.meta.arg;
      const newTag = action.payload.DT;
      const note = state.listNotes.find((n) => n.id === noteId);
      if (note && !note.tags.some((tag) => tag.id === tagId)) {
        note.tags.push(newTag);
      }

      const archiveNote = state.archivedNotes.find((a) => a.id == noteId);
      if (archiveNote && !archiveNote.tags.some((tag) => tag.id == tagId)) {
        archiveNote.tags.push(newTag);
      }

      const pinnedNote = state.pinnedNotes.find((p) => p.id == noteId);
      if (pinnedNote && !pinnedNote.tags.some((tag) => tag.id == tagId)) {
        pinnedNote.tags.push(newTag);
      }

      const noteByTag = state.listNotesByTag.find((t) => t.id == noteId);
      if (noteByTag && !noteByTag.tags.some((tag) => tag.id == tagId)) {
        noteByTag.tags.push(newTag);
      }
    })
    .addCase(addTagToNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to add tag to note");
    })

    // Add multiple tags
    .addCase(addMultipleTags.pending, handlePending)
    .addCase(addMultipleTags.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.message;
      const { noteId } = action.meta.arg;
      const newTags = action.payload.DT.map((t) => ({
        id: t.tagId,
        name: t.tagName,
      }));

      const note = state.listNotes.find((n) => n.id == noteId);
      if (note) {
        note.tags = [...(note.tags ?? []), ...newTags];
      }
    })
    .addCase(addMultipleTags.rejected, (state, action) => {
      handleRejected(state, action, "Failed to add multiple tags to note");
    })

    // Remove tag from note
    .addCase(removeTagNote.pending, handlePending)
    .addCase(removeTagNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.message;
      const { noteId, tagId } = action.meta.arg;
      const note = state.listNotes.find((n) => n.id == noteId);

      if (note) {
        note.tags = note.tags.filter((tag) => tag.id !== tagId);
      }

      const pinnedNote = state.pinnedNotes.find((p) => p.id == noteId);
      if (pinnedNote) {
        pinnedNote.tags = pinnedNote.tags.filter((tag) => tag.id !== tagId);
      }

      const archiveNote = state.archivedNotes.find((a) => a.id == noteId);
      if (archiveNote) {
        archiveNote.tags = archiveNote.tags.filter((tag) => tag.id !== tagId);
      }

      const noteByTag = state.listNotesByTag.find((t) => t.id == noteId);
      const currentTagId = noteByTag?.currentTag;
      if (noteByTag && currentTagId == tagId) {
        state.listNotesByTag = state.listNotesByTag.filter(
          (n) => n.id !== noteId
        );
      }
      if (noteByTag && currentTagId != tagId) {
        noteByTag.tags = noteByTag.tags.filter((tag) => tag.id != tagId);
      }
    })
    .addCase(removeTagNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to remove tag from note");
    });
};
