const File = require("../models/file");
const Folder = require("../models/folder");
const AppError = require("../utils/AppError");
const fs = require("fs");

async function showFiles(userId) {
  const folders = await Folder.find({
    owner: userId,
  }).sort({ createdAt: -1 });

  const files = await File.find({
    owner: userId,
    folder: null,
  }).sort({ createdAt: -1 });

  return {
    folders,
    files,
  };
}

async function uploadFile({ file, userId, folderId }) {
  if (!file) {
    throw new AppError("Please select a file", 400);
  }

  const createdFile = await File.create({
    filename: file.originalname,
    contentType: file.mimetype,
    size: file.size,
    path: file.path,
    owner: userId,
    folder: folderId || null,
  });

  return createdFile;
}

async function viewFile(fileId, userId) {
  const file = await File.findOne({
    _id: fileId,
    owner: userId,
  });

  if (!file) {
    throw new AppError("File not found", 404);
  }

  return file;
}

async function deleteFile(fileId, userId) {
  const file = await File.findOne({
    _id: fileId,
    owner: userId,
  });

  if (!file) {
    throw new AppError("File not found", 404);
  }

  // Delete physical file from uploads folder
  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  // Delete file record from MongoDB
  await File.deleteOne({
    _id: fileId,
    owner: userId,
  });

  return true;
}

module.exports = {
  showFiles,
  uploadFile,
  viewFile,
  deleteFile,
};
