import { createReminder, deleteReminder, editReminder } from "../../api/remind";

export const remindExtraReducers = (builder, handlePending, handleRejected) => {
  builder
    // create reminder
    .addCase(createReminder.pending, handlePending)
    .addCase(createReminder.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const { noteID } = action.payload.DT;
      const newReminder = action.payload.DT;

      const addReminder = (note) => {
        if (note) {
          const target = note.note ? note.note : note; 
          target.reminders = [...(target.reminders || []), newReminder];
        }
      };

      addReminder(state.listNotes.find((n) => n.id == noteID));
      addReminder(state.pinnedNotes.find((p) => p.id == noteID));
      addReminder(state.archivedNotes.find((a) => a.id == noteID));
      addReminder(state.listNotesByTag.find((t) => t.id == noteID));

      const collab = state.collabNotes.find((c) => c.noteID == noteID);
      if (collab) addReminder(collab);
    })

    // edit reminder
    .addCase(editReminder.pending, handlePending)
    .addCase(editReminder.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const { noteId, id, time, repeat } = action.payload.DT;

      const updateReminder = (note) => {
        if (note) {
          const target = note.note ? note.note : note;
          if (target.reminders) {
            const reminder = target.reminders.find((r) => r.id === id);
            if (reminder) {
              reminder.time = time;
              reminder.repeat = repeat;
            }
          }
        }
      };

      updateReminder(state.listNotes.find((n) => n.id == noteId));
      updateReminder(state.pinnedNotes.find((p) => p.id == noteId));
      updateReminder(state.archivedNotes.find((a) => a.id == noteId));
      updateReminder(state.listNotesByTag.find((t) => t.id == noteId));

      const collab = state.collabNotes.find((c) => c.noteID == noteId);
      if (collab) updateReminder(collab);
    })

    // delete reminder
    .addCase(deleteReminder.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const { noteID, reminderId } = action.payload.DT;

      const removeReminder = (note) => {
        if (note) {
          const target = note.note ? note.note : note;
          if (target.reminders) {
            target.reminders = target.reminders.filter(
              (r) => r.id != reminderId,
            );
          }
        }
      };

      removeReminder(state.listNotes.find((n) => n.id == noteID));
      removeReminder(state.pinnedNotes.find((p) => p.id == noteID));
      removeReminder(state.archivedNotes.find((a) => a.id == noteID));
      removeReminder(state.listNotesByTag.find((t) => t.id == noteID));

      const collab = state.collabNotes.find((c) => c.noteID == noteID);
      if (collab) removeReminder(collab);
    })

    .addCase(deleteReminder.rejected, (state, action) => {
      handleRejected(state, action, "Failed to delete reminder to note");
    });
};
