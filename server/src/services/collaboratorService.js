const { sendEmail } = require("../ultities/email");
const db = require("../models");
const CustomError = require("../ultities/CustomError");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
require("dotenv").config();

const getCollaborators = async (userId, noteId) => {
  try {
    const collaborators = await db.NoteCollaborator.findAll({
      where: { noteID: noteId },
      attributes: ["permission", "noteID"],
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["username", "email", "avatar", "fullname", "id"],
        },
        {
          model: db.Note,
          as: "note",
          attributes: [],
          where: { userID: userId },
        },
      ],
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Get collaborators successfully",
      DT: collaborators.map((c) => ({
        noteId: c.noteID,
        permission: c.permission,
        username: c.user.username,
        fullname: c.user.fullname,
        avatar: c.user.avatar,
        email: c.user.email,
        userId: c.user.id,
      })),
    };
  } catch (error) {
    throw error;
  }
};

const addCollaboratorInvitation = async (userId, noteId, collaboratorData) => {
  try {
    const { email, permission } = collaboratorData;

    const note = await db.Note.findOne({
      where: { id: noteId, deletedAt: null },
    });

    if (!note || note.userID !== userId) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.FORBIDDEN,
      );
    }

    const collaborator = await db.User.findOne({
      where: { email },
      attributes: ["id", "email", "fullname"],
    });

    if (!collaborator) {
      throw new CustomError("User not found in system", StatusCodes.NOT_FOUND);
    }

    if (collaborator.id === userId) {
      throw new CustomError("Cannot invite yourself", StatusCodes.NOT_FOUND);
    }

    const existingCollaborator = await db.NoteCollaborator.findOne({
      where: { noteID: noteId, userID: collaborator.id },
    });

    if (existingCollaborator) {
      throw new CustomError("User was invited", StatusCodes.NOT_FOUND);
    }

    const existingInvitation = await db.CollaboratorInvitation.findOne({
      where: { noteID: noteId, userID: collaborator.id, status: "pending" },
    });

    if (existingInvitation) {
      throw new CustomError(
        "An invitation is already pending",
        StatusCodes.NOT_FOUND,
      );
    }

    const inviter = await db.User.findByPk(userId, {
      attributes: ["email", "fullname"],
    });
    if (!inviter) {
      throw new CustomError("Inviter not found", StatusCodes.NOT_FOUND);
    }

    const invitationToken = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const invitation = await db.sequelize.transaction(async (t) => {
      const newInvitation = await db.CollaboratorInvitation.create(
        {
          token: invitationToken,
          noteID: noteId,
          userID: collaborator.id,
          inviterID: userId,
          permission,
          expiresAt,
        },
        { transaction: t },
      );

      return newInvitation;
    });

    await sendEmail({
      to: collaborator.email,
      subject: `Invitation to Collaborate on "${note.title}"`,
      html: `
    <p>Hello ${collaborator.fullname || collaborator.email},</p>
    <p>${
      inviter.fullname || inviter.email
    } has invited you to collaborate on "<strong>${
      note.title
    }</strong>" with <strong>${permission}</strong> permission.</p>
    <div style="margin: 30px 0;">
    <a href="${process.env.REACT_URL}/accept-invitation?token=${invitationToken}" 
             style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
             Accept Invitation
    </a>
    </div>
    <p>This invitation is valid for 24 hours.</p>
    <p>If you have any questions, reply to this email to contact the inviter.</p>
    <p>If you did not expect this invitation, please ignore this email.</p>
  `,
      replyTo: inviter.email,
    });

    return {
      statusCode: true,
      message: "Invitation sent successfully",
      DT: {
        noteId,
        email: collaborator.email,
        permission,
        invitationId: invitation.id,
      },
    };
  } catch (error) {
    throw error;
  }
};

const acceptCollaboratorInvitation = async (token) => {
  try {
    const invitation = await db.CollaboratorInvitation.findOne({
      where: {
        token: token,
        status: "pending",
      },
    });

    if (!invitation) {
      throw new CustomError(
        "Invalid or already used invitation",
        StatusCodes.NOT_FOUND,
      );
    }

    // Kiểm tra hết hạn
    if (new Date() > invitation.expiresAt) {
      await invitation.update({ status: "expired" });
      throw new CustomError("Invitation has expired", StatusCodes.BAD_REQUEST);
    }

    await db.sequelize.transaction(async (t) => {
      // Dùng invitation.userID có sẵn trong DB để tạo collaborator
      await db.NoteCollaborator.findOrCreate({
        where: {
          noteID: invitation.noteID,
          userID: invitation.userID,
        },
        defaults: { permission: invitation.permission },
        transaction: t,
      });

      await invitation.update({ status: "accepted" }, { transaction: t });
      await db.NotePreference.findOrCreate({
        where: {
          noteID: invitation.noteID,
          userID: invitation.userID,
        },
        defaults: {
          isPinned: false,
          isArchived: false,
        },
        transaction: t,
      });
    });

    const reminders = await db.Reminder.findAll({
      where: { noteID: invitation.noteID },
    });

    const statusRecords = reminders.map((r) => ({
      reminderID: r.id,
      userID: invitation.userID,
      status: "pending",
      lastNotified: null,
    }));

    await db.ReminderUserStatus.bulkCreate(statusRecords);

    return {
      statusCode: StatusCodes.OK,
      message: "Collaboration accepted successfully",
      DT: { noteId: invitation.noteID },
    };
  } catch (error) {
    throw error;
  }
};

const removeCollaborator = async (noteId, collaboratorUserId, userId) => {
  const t = await db.sequelize.transaction();
  try {
    const note = await db.Note.findOne({
      where: { id: noteId, userID: userId },
    });

    if (!note) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.FORBIDDEN,
      );
    }

    if (collaboratorUserId === userId) {
      throw new CustomError("Can not remove yourself", StatusCodes.BAD_REQUEST);
    }

    const collaborator = await db.NoteCollaborator.findOne({
      where: { noteID: noteId, userID: collaboratorUserId },
    });

    if (!collaborator) {
      throw new CustomError("Collaborator not found", StatusCodes.NOT_FOUND);
    }

    await collaborator.destroy();

    await db.NotePreference.destroy({
      where: { noteID: noteId, userID: collaboratorUserId },
      transaction: t,
    });

    const reminderIds = await db.Reminder.findAll({
      where: { noteID: noteId },
      attributes: ["id"],
      raw: true,
    }).then((rems) => rems.map((r) => r.id));

    if (reminderIds.length > 0) {
      await db.ReminderUserStatus.destroy({
        where: {
          userID: collaboratorUserId,
          reminderID: { [db.Sequelize.Op.in]: reminderIds },
        },
        transaction: t,
      });
    }
    await t.commit();

    return {
      statusCode: StatusCodes.OK,
      message: "Collaborator removed successfully",
      DT: { noteId, collaboratorUserId: collaboratorUserId },
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const leaveNote = async (noteId, userId) => {
  try {
    const note = await db.Note.findOne({
      where: { id: noteId, userID: userId },
    });

    if (note) {
      throw new CustomError(
        "Owner cannot leave their own note",
        StatusCodes.BAD_REQUEST,
      );
    }

    const collaborator = await db.NoteCollaborator.findOne({
      where: { noteID: noteId, userID: userId },
    });

    const noteReference = await db.NotePreference.findOne({
      where: { noteID: noteId, userID: userId },
    });

    if (!collaborator && noteReference) {
      throw new CustomError(
        "You are not a collaborator of this note",
        StatusCodes.NOT_FOUND,
      );
    }

    await collaborator.destroy();
    await noteReference.destroy();

    return {
      statusCode: StatusCodes.OK,
      message: "You have left the note successfully",
      DT: { noteId, userId },
    };
  } catch (error) {
    throw error;
  }
};

const updateCollaboratorPermission = async (
  userId,
  noteId,
  collaboratorUserId,
  newPermission,
) => {
  try {
    const note = await db.Note.findOne({
      where: { id: noteId, deletedAt: null },
    });
    if (!note || note.userID !== userId) {
      throw new CustomError(
        "Note not found or unauthorized",
        StatusCodes.FORBIDDEN,
      );
    }

    const existingCollaborator = await db.NoteCollaborator.findOne({
      where: { noteID: noteId, userID: collaboratorUserId },
    });

    if (!existingCollaborator) {
      throw new CustomError("Collaborator not found", StatusCodes.NOT_FOUND);
    }

    existingCollaborator.permission = newPermission;
    await existingCollaborator.save();
    return {
      statusCode: StatusCodes.OK,
      message: "Collaborator permission updated successfully",
      DT: {
        noteId,
        collaboratorUserId: collaboratorUserId,
        permission: newPermission,
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCollaborators,
  addCollaboratorInvitation,
  acceptCollaboratorInvitation,
  removeCollaborator,
  updateCollaboratorPermission,
  leaveNote,
};
