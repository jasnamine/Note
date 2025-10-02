const moment = require("moment-timezone");
const db = require("../models");
const CustomError = require("../ultities/CustomError");
const { sendEmail } = require("../ultities/email");
import { StatusCodes } from "http-status-codes";
const { Op } = require("sequelize");

const sendEmailRemind = async () => {
  try {
    const statuses = await db.ReminderUserStatus.findAll({
      where: { status: "pending", reminderID: { [Op.ne]: null } },
      include: [
        {
          model: db.Reminder,
          as: "reminder",
          include: [
            {
              model: db.Note,
              as: "note",
              include: [
                {
                  model: db.User,
                  as: "owner",
                  attributes: ["id", "username", "email"],
                },
                { model: db.NoteCollaborator, as: "collaborators" },
              ],
            },
          ],
        },
        { model: db.User, as: "user", attributes: ["id", "username", "email"] },
      ],
    });

    const localTZ = moment.tz.guess();
    const now = moment().tz(localTZ);

    for (const status of statuses) {
      const r = status.reminder;
      const note = r.note;
      const user = status.user;

      if (!note || !user) continue;

      const reminderTime = moment.utc(r.time).tz(localTZ);
      const timeDiff = Math.abs(now.diff(reminderTime, "minutes")) <= 15;

      let send = false;
      switch (r.repeat) {
        case "none":
          send = !status.lastNotified && timeDiff;
          break;
        case "daily":
          send =
            timeDiff &&
            (!status.lastNotified ||
              !moment(status.lastNotified).isSame(now, "day"));
          break;
        case "weekly":
          send =
            now.isoWeekday() === reminderTime.isoWeekday() &&
            timeDiff &&
            (!status.lastNotified ||
              !moment(status.lastNotified).isSame(now, "week"));
          break;
        case "monthly":
          const targetDay = reminderTime.date();
          const maxDay = now.clone().endOf("month").date();
          send =
            now.date() === Math.min(targetDay, maxDay) &&
            timeDiff &&
            (!status.lastNotified ||
              !moment(status.lastNotified).isSame(now, "month"));
          break;
      }

      if (!send) continue;

      // Gửi email
      const noteTitle = note.title || "Untitled Note";
      const subject = `Reminder: ${noteTitle}`;
      const text = `Hi ${
        user.username
      },\n\nYou have an upcoming reminder for "${noteTitle}" at ${reminderTime.format(
        "YYYY-MM-DD HH:mm"
      )}.\n\nDon’t forget!\n\n— JAS Reminder`;

      await sendEmail({
        from: `"JAS Reminder" <${process.env.EMAIL_NAME}>`,
        to: user.email,
        subject,
        text,
      });

      await db.ReminderUserStatus.update(
        { lastNotified: new Date(), status: "sent" },
        { where: { id: status.id } }
      );
    }

    return { statusCode: StatusCodes.OK, message: "Reminders processed" };
  } catch (error) {
    throw error;
  }
};

const createReminder = async (userId, noteId, time, repeat) => {
  try {
    const note = await db.Note.findOne({
      where: { id: noteId, deletedAt: null },
    });
    if (
      !note ||
      (note.userID !== userId &&
        !(await db.NoteCollaborator.findOne({
          where: { noteID: noteId, userID: userId, permission: "edit" },
        })))
    ) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.FORBIDDEN
      );
    }

    const reminder = await db.Reminder.create({ noteID: noteId, time, repeat });

    const users = [note.userID];
    const collabs = await db.NoteCollaborator.findAll({
      where: { noteID: noteId },
    });
    collabs.forEach((c) => users.push(c.userID));

    const statusRecords = users.map((u) => ({
      reminderID: reminder.id,
      userID: u,
    }));
    await db.ReminderUserStatus.bulkCreate(statusRecords);

    await db.NoteHistory.create({
      noteID: noteId,
      reminder: { id: reminder.id, time, repeat },
      action: "create",
      modifiedBy: userId,
      modifiedAt: new Date(),
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Reminder created",
      DT: reminder,
    };
  } catch (error) {
    throw error;
  }
};

const updateReminder = async (userId, noteId, reminderId, time, repeat) => {
  try {
    const note = await db.Note.findOne({
      where: { id: noteId, deletedAt: null },
    });
    if (
      !note ||
      (note.userID !== userId &&
        !(await db.NoteCollaborator.findOne({
          where: { noteID: noteId, userID: userId, permission: "edit" },
        })))
    ) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.FORBIDDEN
      );
    }

    const reminder = await db.Reminder.findOne({
      where: { id: reminderId, noteID: noteId },
    });
    if (!reminder)
      throw new CustomError("Reminder not found", StatusCodes.NOT_FOUND);

    await db.Reminder.update({ time, repeat }, { where: { id: reminderId } });

    await db.ReminderUserStatus.update(
      { lastNotified: null, status: "pending" },
      { where: { reminderID: reminderId } }
    );

    await db.NoteHistory.create({
      noteID: noteId,
      reminder: { id: reminderId, time, repeat },
      action: "update",
      modifiedBy: userId,
      modifiedAt: new Date(),
    });

    return { statusCode: StatusCodes.OK, message: "Reminder updated" };
  } catch (error) {
    throw error;
  }
};

const deleteReminder = async (userId, noteId, reminderId) => {
  try {
    const note = await db.Note.findOne({
      where: { id: noteId, deletedAt: null },
    });
    if (
      !note ||
      (note.userID !== userId &&
        !(await db.NoteCollaborator.findOne({
          where: { noteID: noteId, userID: userId, permission: "edit" },
        })))
    )
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.FORBIDDEN
      );

    const reminder = await db.Reminder.findOne({
      where: { id: reminderId, noteID: noteId },
    });
    if (!reminder)
      throw new CustomError("Reminder not found", StatusCodes.NOT_FOUND);

    await db.Reminder.destroy({ where: { id: reminderId } });
    await db.ReminderUserStatus.destroy({ where: { id: reminderId } });

    await db.NoteHistory.create({
      noteID: noteId,
      reminder: {
        id: reminder.id,
        time: reminder.time,
        repeat: reminder.repeat,
      },
      action: "delete",
      modifiedBy: userId,
      modifiedAt: new Date(),
    });

    return { statusCode: StatusCodes.OK, message: "Reminder deleted" };
  } catch (error) {
    throw error;
  }
};



module.exports = {
  sendEmailRemind,
  createReminder,
  updateReminder,
  deleteReminder,
};
