const { cloudinary } = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "note_images",
    allowed_formats: ["jpg", "png", "jpeg", "svg"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

const uploadNoteImage = multer({
  storage,
  limits: { files: 15 },
});

module.exports = uploadNoteImage;
