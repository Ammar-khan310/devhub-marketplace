const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Folder = require("../models/folder");
const AppError = require("../utils/AppError");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      // ROOT UPLOAD
      if (!req.params.folderId) {
        return cb(null, uploadDir);
      }

      // FIND FOLDER
      const folder = await Folder.findOne({
        _id: req.params.folderId,
        owner: req.user._id,
      });

      if (!folder) {
        return cb(new AppError("Folder not found", 404), false);
      }

      // Create physical folder
      const folderPath = path.join(uploadDir, folder.name);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, {
          recursive: true,
        });
      }

      cb(null, folderPath);
    } catch (error) {
      cb(error);
    }
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  // console.log("FILE NAME:", file.originalname);
  // console.log("FILE MIME TYPE:", file.mimetype);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/octet-stream",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new AppError("Only JPG, PNG, WEBP and PDF files are allowed", 400),
      false,
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = upload;
