const db = require("../models");
const { getPublicIdFromUrl } = require("../ultities/cloudinary");
const CustomError = require("../ultities/CustomError");
const { StatusCodes } = require("http-status-codes");
const { cloudinary } = require("../config/cloudinary");

const uploadImageNote = async (files, noteId, userId) => {
  try {
    const note =
      (await db.Note.findOne({
        where: { id: noteId, userID: userId },
      })) ||
      (await db.NoteCollaborator.findOne({
        where: { noteID: noteId, userID: userId, permission: "edit" },
      }));
    if (!note) {
      throw new CustomError("Note not found or no permission", StatusCodes.FORBIDDEN);
    }

    const existingCount = await db.NoteImage.count({
      where: { noteID: noteId },
    });
    if (existingCount + files.length > 15) {
      throw new CustomError("Exceed maximum 15 images per note", StatusCodes.BAD_REQUEST);
    }

    const uploaded = await Promise.all(
      files.map((file) =>
        db.NoteImage.create({
          noteID: noteId,
          type: "image",
          url: file.path,
        })
      )
    );

    const imageHistory = uploaded.map((img) => ({
      id: img.id,
      url: img.url,
    }));

    await db.NoteHistory.create({
      noteID: noteId,
      image: imageHistory,
      action: "create",
      modifiedBy: userId,
      modifiedAt: new Date(),
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Upload images successfully",
      DT: uploaded,
    };
  } catch (error) {
    throw error;
  }
};

const deleteImageNote = async (imageUrl, noteId, userId) => {
  try {
    const note =
      (await db.Note.findOne({ where: { id: noteId, userID: userId } })) ||
      (await db.NoteCollaborator.findOne({
        where: { noteID: noteId, userID: userId, permission: "edit" },
      }));
    
    if (!note) {
      throw new CustomError("Note not found or no permission", StatusCodes.FORBIDDEN);
    }

    const image = await db.NoteImage.findOne({
      where: { noteID: noteId, url: imageUrl },
    });

    if (!image) {
      throw new CustomError("Image not found in note", StatusCodes.NOT_FOUND);
    }

    const publicId = getPublicIdFromUrl(imageUrl);
    if (!publicId) {
      throw new CustomError("Invalid image URL", StatusCodes.NOT_FOUND);
    }

    await cloudinary.uploader.destroy(publicId);

    await image.destroy();

    await db.NoteHistory.create({
      noteID: noteId,
      action: "delete",
      modifiedBy: userId,
      modifiedAt: new Date(),
    });

    return {
      statusCode: StatusCodes.OK,
      message: "Image deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { uploadImageNote, deleteImageNote };
