import {
  createMultipleReminders,
  createReminder,
  deleteReminder,
  editReminder,
  getReminders,
} from "../../api/remind";

export const remindExtraReducers = (builder, handlePending, handleRejected) => {
  builder
    // get reminders to note
    .addCase(getReminders.pending, handlePending)
    .addCase(getReminders.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const { noteID } = action.payload.DT;
      const note = state.listNotes.find((n) => n.id === noteID);
      if (note) {
        note.reminders = action.payload.DT || [];
      }
    })
    .addCase(getReminders.rejected, (state, action) => {
      handleRejected(state, action, "Failed to get reminders for a note");
    })

    // create reminder to note
    .addCase(createReminder.pending, handlePending)
    .addCase(createReminder.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.EM;
      const { noteID } = action.payload.DT;
      const newReminder = action.payload.DT;
      const note = state.listNotes.find((n) => n.id === noteID);
      if (note) {
        note.reminders.push(newReminder);
      }
    })
    .addCase(createReminder.rejected, (state, action) => {
      handleRejected(state, action, "Failed to create reminder to note");
    })

    // create reminders to note
    .addCase(createMultipleReminders.pending, handlePending)
    .addCase(createMultipleReminders.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.message;
      const { noteId } = action.meta.arg;
      const newReminders = action.payload.DT.map((r) => ({
        id: r.id,
        time: r.time,
        repeat: r.repeat,
      }));

      const note = state.listNotes.find((n) => n.id == noteId);
      if (note) {
        note.reminders = [...(note.reminders ?? []), ...newReminders];
      }
    })
    .addCase(createMultipleReminders.rejected, (state, action) => {
      handleRejected(state, action, "Failed to create reminder to note");
    })

    // edit reminder
    .addCase(editReminder.pending, handlePending)
    .addCase(editReminder.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.message;
      console.log(action.payload)
      const { noteId, time, repeat, id } = action.payload.DT;
      const note = state.listNotes.find((n) => n.id === noteId);
      console.log(note)

      if (note) {
        const reminder = note.reminders.find((r) => r.id === id);
        if (reminder) {
          reminder.time = time;
          reminder.repeat = repeat;
        }
      }
    })
    .addCase(editReminder.rejected, (state, action) => {
      handleRejected(state, action, "Failed to edit reminder to note");
    })

    // delete reminder
    .addCase(deleteReminder.pending, handlePending)
    .addCase(deleteReminder.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.success = true;
      state.message = action.payload.message;
      const { noteID, reminderId } = action.payload.DT;
      const note = state.listNotes.find((n) => n.id == noteID);
      if (note) {
        note.reminders = note.reminders.filter((n) => n.id != reminderId);
      }
    })
    .addCase(deleteReminder.rejected, (state, action) => {
      handleRejected(state, action, "Failed to delete reminder to note");
    });
};
