import {
  addNote,
  archivedNote,
  deleteNote,
  editNote,
  getArchivedNotes,
  getCollabNotes,
  getDeletedNotes,
  getNotes,
  getNotesByTag,
  getPinnedNotes,
  pinNote,
  restoreNote,
  settingNote,
  softDeleteNote,
} from "../../api/note";

export const noteExtraReducers = (builder, handlePending, handleRejected) => {
  // Get notes
  builder
    .addCase(getNotes.pending, handlePending)
    .addCase(getNotes.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      state.listNotes = action.payload.DT.map((note) => ({
        ...note,
        tags: note.tags || [],
        reminders: note.reminders || [],
        images: note.images || [],
        collaborators: note.collaborators || [],
      }));
    })
    .addCase(getNotes.rejected, (state, action) => {
      handleRejected(state, action, "Failed to fetch notes");
    })

    // Add note
    .addCase(addNote.pending, handlePending)
    .addCase(addNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const newNote = action.payload.DT;
      state.listNotes.push({
        ...newNote,
        tags: [],
      });
    })
    .addCase(addNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to add note");
    })

    // Edit note
    .addCase(editNote.pending, handlePending)
    .addCase(editNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const { id, content, title, checklists } = action.payload.DT;

      const note = state.listNotes.find((n) => n.id == id);
      if (note) {
        note.title = title;
        note.content = content;
        note.checklists = checklists;
      }

      const pinnedNote = state.pinnedNotes.find((p) => p.id == id);
      if (pinnedNote) {
        pinnedNote.title = title;
        pinnedNote.content = content;
        pinnedNote.checklists = checklists;
      }

      const collabNote = state.collabNotes.find((c) => c.noteID == id);
      if (collabNote && collabNote.permission == "edit") {
        collabNote.note.title = title;
        collabNote.note.content = content;
        collabNote.note.checklists = checklists;
      }

      const archivedNote = state.archivedNotes.find((a) => a.id == id);
      if (archivedNote) {
        archivedNote.title = title;
        archivedNote.content = content;
        archivedNote.checklists = checklists;
      }

      const noteByTag = state.listNotesByTag.find((t) => t.id == id);
      if (noteByTag) {
        noteByTag.title = title;
        noteByTag.content = content;
        noteByTag.checklists = checklists;
      }
    })
    .addCase(editNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to edit note");
    })

    // soft delete note
    .addCase(softDeleteNote.pending, handlePending)
    .addCase(softDeleteNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const { noteId } = action.meta.arg;

      const note = state.listNotes.find((n) => n.id === noteId);
      if (note) {
        note.isDeleted = true;
        state.deleteNotes.push(note);
        state.listNotes = state.listNotes.filter((n) => n.id != noteId);
      }

      const pinnedNote = state.pinnedNotes.find((p) => p.id == noteId);
      if (pinnedNote) {
        pinnedNote.isDeleted = true;
        state.deleteNotes.push(note);
        state.pinnedNotes = state.pinnedNotes.filter((p) => p.id != noteId);
      }

      const archivedNote = state.archivedNotes.find((a) => a.id == noteId);
      if (archivedNote) {
        archivedNote.isDeleted = true;
        state.deleteNotes.push(archivedNote);
        state.archivedNotes = state.archivedNotes.filter((a) => a.id != noteId);
      }

      const noteByTag = state.listNotesByTag.find((t) => t.id == noteId);
      if (noteByTag) {
        noteByTag.isDeleted = true;
        state.deleteNotes.push(archivedNote);
        state.listNotesByTag = state.listNotesByTag.filter(
          (a) => a.id != noteId
        );
      }
    })
    .addCase(softDeleteNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to archive note");
    })

    // Restore note
    .addCase(restoreNote.pending, handlePending)
    .addCase(restoreNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const { noteId } = action.meta.arg;

      const note = state.deleteNotes.find((n) => n.id == noteId);
      if (note) {
        note.isDeleted = false;
        state.listNotes.push(note);
        state.deleteNotes = state.deleteNotes.filter((n) => n.id != noteId);
      }

      const pinnedNote = state.pinnedNotes.find((p) => p.id == noteId);
      if (pinnedNote) {
        pinnedNote.isDeleted = false;
        state.pinnedNotes.push(note);
        state.deleteNotes = state.deleteNotes.filter((p) => p.id != noteId);
      }

      const archivedNote = state.archivedNotes.find((a) => a.id == noteId);
      if (archivedNote) {
        archivedNote.isDeleted = false;
        state.archivedNotes.push(archivedNote);
        state.deleteNotes = state.deleteNotes.filter((a) => a.id != noteId);
      }

      const noteByTag = state.listNotesByTag.find((t) => t.id == noteId);
      if (noteByTag) {
        noteByTag.isDeleted = false;
        state.listNotesByTag.push(archivedNote);
        state.deleteNotes = state.deleteNotes.filter((a) => a.id != noteId);
      }
    })
    .addCase(restoreNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to restore note");
    })

    // Delete note forever
    .addCase(deleteNote.pending, handlePending)
    .addCase(deleteNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const { noteId } = action.meta.arg;
      state.deleteNotes = state.deleteNotes.filter((n) => n.id !== noteId);
    })
    .addCase(deleteNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to delete note");
    })

    // Get deleted notes
    .addCase(getDeletedNotes.pending, handlePending)
    .addCase(getDeletedNotes.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      state.deleteNotes = action.payload.DT.map((note) => ({
        ...note,
        tags: note.tags || [],
        images: note.images || [],
        isDeleted: true,
      }));
    })
    .addCase(getDeletedNotes.rejected, (state, action) => {
      handleRejected(state, action, "Failed to get deleted notes");
    })

    // Archive note
    .addCase(archivedNote.pending, handlePending)
    .addCase(archivedNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;

      const { isArchived, noteID } = action.payload.DT;

      let pinNote =
        state.pinnedNotes.find((p) => p.id == noteID) ||
        state.archivedNotes.find(
          (n) => n.id == noteID && n.preferences[0]?.isPinned
        );

      let otherNote =
        state.listNotes.find((n) => n.id == noteID) ||
        state.archivedNotes.find(
          (n) => n.id == noteID && !n.preferences[0]?.isPinned
        );

      let collabNote =
        state.collabNotes.find((c) => c.noteID == noteID) ||
        state.archivedNotes.find((n) => n.id == noteID && n.owner);

      if (pinNote) {
        pinNote.preferences[0].isArchived = isArchived;

        if (isArchived) {
          state.archivedNotes.unshift(pinNote);
          state.pinnedNotes = state.pinnedNotes.filter((p) => p.id != noteID);
        } else {
          state.archivedNotes = state.archivedNotes.filter(
            (note) => note.id != noteID
          );
          if (pinNote.preferences[0].isPinned) {
            state.pinnedNotes.push(pinNote);
          } else {
            state.listNotes.push(pinNote);
          }
        }
      } else if (otherNote) {
        otherNote.preferences[0].isArchived = isArchived;

        if (isArchived) {
          state.listNotes = state.listNotes.filter((n) => n.id != noteID);
          state.archivedNotes.unshift(otherNote);
        } else {
          state.archivedNotes = state.archivedNotes.filter(
            (note) => note.id != noteID
          );
          state.listNotes.push(otherNote);
        }
      } else if (collabNote) {
        collabNote.note.preferences[0].isArchived = isArchived;

        if (isArchived) {
          state.collabNotes = state.collabNotes.filter(
            (c) => c.noteID != noteID
          );
          state.archivedNotes.unshift(collabNote.note);
        } else {
          state.archivedNotes = state.archivedNotes.filter(
            (note) => note.id != noteID
          );
          state.collabNotes.push(collabNote);
        }
      }
    })

    .addCase(archivedNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to pin note");
    })

    // Get archived notes
    .addCase(getArchivedNotes.pending, handlePending)
    .addCase(getArchivedNotes.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      state.archivedNotes = action.payload.DT.map((note) => ({
        ...note,
        tags: note.tags || [],
        images: note.images || [],
        isArchived: true,
      }));
    })
    .addCase(getArchivedNotes.rejected, (state, action) => {
      handleRejected(state, action, "Failed to get archived notes");
    })

    // Get notes by tagId
    .addCase(getNotesByTag.pending, handlePending)
    .addCase(getNotesByTag.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const { tagId } = action.meta.arg;
      state.listNotesByTag = action.payload.DT.map((note) => ({
        ...note,
        tags: note.tags || [],
        reminders: note.reminders || [],
        images: note.images || [],
        collaborators: note.collaborators || [],
        currentTag: tagId,
      }));
    })
    .addCase(getNotesByTag.rejected, (state, action) => {
      handleRejected(state, action, "Failed to get deleted notes");
    })

    // Get pinned note
    .addCase(getPinnedNotes.pending, handlePending)
    .addCase(getPinnedNotes.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      state.pinnedNotes = action.payload.DT.map((note) => ({
        ...note,
        tags: note.tags || [],
        reminders: note.reminders || [],
        images: note.images || [],
        collaborators: note.collaborators || [],
      }));
    })
    .addCase(getPinnedNotes.rejected, (state, action) => {
      handleRejected(state, action, "Failed to get deleted notes");
    })

    // Get notes by collab
    .addCase(getCollabNotes.pending, handlePending)
    .addCase(getCollabNotes.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      state.collabNotes = action.payload.DT.map((note) => ({
        ...note,
        tags: note.tags || [],
        reminders: note.reminders || [],
        images: note.images || [],
        collaborators: note.collaborators || [],
      }));
    })
    .addCase(getCollabNotes.rejected, (state, action) => {
      handleRejected(state, action, "Failed to get deleted notes");
    })

    // setting note
    .addCase(settingNote.pending, handlePending)
    .addCase(settingNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const { id, color, theme } = action.payload.DT;

      const note = state.listNotes.find((n) => n.id == id);
      const collabNote = state.collabNotes.find((c) => c.noteID == id);
      const pinnedNote = state.pinnedNotes.find((p) => p.id == id);
      const archivedNote = state.archivedNotes.find((a) => a.id == id);
      const noteByTag = state.listNotesByTag.find((t) => t.id == id);
      if (note) {
        note.color = color;
        note.theme = theme;
      }
      if (collabNote) {
        collabNote.note.color = color;
        collabNote.note.theme = theme;
      }
      if (pinnedNote) {
        pinnedNote.color = color;
        pinnedNote.theme = theme;
      }
      if (archivedNote) {
        archivedNote.color = color;
        archivedNote.theme = theme;
      }
      if (noteByTag) {
        noteByTag.color = color;
        noteByTag.theme = theme;
      }
    })
    .addCase(settingNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to setting note");
    })

    // Pin note
    .addCase(pinNote.pending, handlePending)
    .addCase(pinNote.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;

      const { isPinned, createdAt, pinnedAt } = action.payload.DT;
      const data = action.payload.DT;

      const pinNote = isPinned
        ? state.listNotes.find((n) => n.id == data.note.id)
        : state.pinnedNotes.find((n) => n.id == data.note.id);

      if (pinNote) {
        console.log("pinNote", JSON.stringify(pinNote, null, 2));

        pinNote.preferences[0].isPinned = isPinned;
        pinNote.preferences[0].createdAt = createdAt;
        pinNote.preferences[0].pinnedAt = pinnedAt;
        if (isPinned) {
          state.pinnedNotes.unshift(pinNote);
          state.listNotes = state.listNotes.filter(
            (note) => note.id != data.note.id
          );
        }
        if (!isPinned) {
          state.listNotes.push(pinNote);
          state.pinnedNotes = state.pinnedNotes.filter(
            (note) => note.id != data.note.id
          );
        }
      } else {
        const note = state.collabNotes.find((n) => n.noteID === data.note.id);

        if (note) {
          note.note.preferences[0].isPinned = isPinned;
          note.note.preferences[0].createdAt = createdAt;
          note.note.preferences[0].pinnedAt = pinnedAt;

          state.collabNotes = state.collabNotes.filter(
            (n) => n.noteID !== data.note.id
          );

          isPinned
            ? state.collabNotes.unshift(note)
            : state.collabNotes.push(note);
        }

        // ===== listNotesByTag =====
        const noteByTag = state.listNotesByTag.find(
          (n) => n.id === data.note.id
        );

        console.log("noteByTag", JSON.stringify(noteByTag, null, 2));

        if (noteByTag) {
          noteByTag.preferences[0].isPinned = isPinned;
          noteByTag.preferences[0].createdAt = createdAt;
          noteByTag.preferences[0].pinnedAt = pinnedAt;

          state.listNotesByTag = state.listNotesByTag.filter(
            (n) => n.id !== data.note.id
          );

          isPinned
            ? state.listNotesByTag.unshift(noteByTag)
            : state.listNotesByTag.push(noteByTag);
        }
      }
    })
    .addCase(pinNote.rejected, (state, action) => {
      handleRejected(state, action, "Failed to pin note");
    });
};
