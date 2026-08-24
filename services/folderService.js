const Folder = require("../models/folder");
const File = require("../models/file");
const AppError = require("../utils/AppError");
const fs = require("fs");

async function createFolder({ name, userId }) {
  if (!name || !name.trim()) {
    throw new AppError("Folder name is required", 400);
  }

  const folder = await Folder.create({
    name: name.trim(),
    owner: userId,
    parentFolder: null,
  });

  return folder;
}

async function openFolder(folderId, userId) {
  const folder = await Folder.findOne({
    _id: folderId,
    owner: userId,
  });

  if (!folder) {
    throw new AppError("Folder not found", 404);
  }

  const folders = await Folder.find({
    owner: userId,
  }).sort({ createdAt: -1 });

  const files = await File.find({
    owner: userId,
    folder: folder._id,
  }).sort({ createdAt: -1 });

  return {
    folder,
    folders,
    files,
  };
}

async function deleteFolder(folderId, userId) {
  const folder = await Folder.findOne({
    _id: folderId,
    owner: userId,
  });

  if (!folder) {
    throw new AppError("Folder not found", 404);
  }

  const files = await File.find({
    folder: folder._id,
    owner: userId,
  });

  // Delete physical files
  for (const file of files) {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }

  // Delete file records from MongoDB
  await File.deleteMany({
    folder: folder._id,
    owner: userId,
  });

  // Delete folder from MongoDB
  await Folder.deleteOne({
    _id: folder._id,
    owner: userId,
  });

  return true;
}

module.exports = {
  createFolder,
  openFolder,
  deleteFolder,
};
