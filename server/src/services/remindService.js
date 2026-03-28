const moment = require("moment-timezone");
const db = require("../models");
const CustomError = require("../ultities/CustomError");
const { sendEmail } = require("../ultities/email");
const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");

const sendEmailRemind = async () => {
  try {
    const localTZ = moment.tz.guess();
    const now = moment().tz(localTZ);

    const startTime = now.clone().subtract(1, "minutes").toDate(); 
    const endTime = now.clone().add(1, "minutes").toDate(); 

    const pendingTasks = await db.ReminderUserStatus.findAll({
      where: {
        status: "pending",
      },
      include: [
        {
          model: db.Reminder,
          as: "reminder",
          where: {
            time: {
              [Op.between]: [startTime, endTime],
            },
          },
          include: [
            {
              model: db.Note,
              as: "note",
              where: { deletedAt: null },
            },
          ],
        },
        {
          model: db.User,
          as: "user",
          attributes: ["id", "email", "username"],
        },
      ],
    });

    if (pendingTasks.length === 0) return;

    for (const task of pendingTasks) {
      const r = task.reminder;
      const user = task.user;
      const reminderTime = moment.utc(r.time).tz(localTZ);

      let shouldSend = false;

      switch (r.repeat) {
        case "none":
          shouldSend = !task.lastNotified;
          break;
        case "daily":
          shouldSend =
            !task.lastNotified || !moment(task.lastNotified).isSame(now, "day");
          break;
        case "weekly":
          shouldSend =
            now.isoWeekday() === reminderTime.isoWeekday() &&
            (!task.lastNotified ||
              !moment(task.lastNotified).isSame(now, "week"));
          break;
        case "monthly":
          const targetDay = reminderTime.date();
          const maxDayInMonth = now.clone().endOf("month").date();
          const actualDayToRemind = Math.min(targetDay, maxDayInMonth);

          shouldSend =
            now.date() === actualDayToRemind &&
            (!task.lastNotified ||
              !moment(task.lastNotified).isSame(now, "month"));
          break;
      }

      if (shouldSend) {
        try {
          await sendEmail({
            to: user.email,
            subject: `[NoteSpace] Reminder: ${r.note.title}`,
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Reminder Notification</h2>
                <p>Hi <b>${user.username}</b>,</p>
                <p>This is a friendly reminder for your note:</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
                   <strong style="font-size: 1.2em; color: #1e40af;">${r.note.title}</strong>
                </div>
                <p><b>Scheduled Time:</b> ${reminderTime.format("hh:mm A, dddd, MMMM Do YYYY")}</p>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                <p style="font-size: 0.85em; color: #6b7280;">
                  This is an automated message from <b>NoteSpace</b>. <br/>
                  If you no longer wish to receive these reminders, you can manage them in your note settings.
                </p>
              </div>
            `,
          });

          const updateData = { lastNotified: new Date() };

          if (r.repeat === "none") {
            updateData.status = "sent";
          }

          await task.update(updateData);

          console.log(`Successfully sent reminder to ${user.email}`);
        } catch (mailErr) {
          console.error(`Failed to send email to ${user.email}:`, mailErr);
        }
      }
    }
  } catch (error) {
    console.error("Error in sendEmailRemind service:", error);
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
        StatusCodes.FORBIDDEN,
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
        StatusCodes.FORBIDDEN,
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
      { where: { reminderID: reminderId } },
    );

    await db.NoteHistory.create({
      noteID: noteId,
      reminder: { id: reminderId, time, repeat },
      action: "update",
      modifiedBy: userId,
      modifiedAt: new Date(),
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Reminder updated",
      DT: { id: reminderId, time, repeat, noteId },
    };
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
        StatusCodes.FORBIDDEN,
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
