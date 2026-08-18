const File = require("../models/file");
const AppError = require("../utils/apperror");
const Folder = require("../models/folder");
const path = require("path");
const fs = require("fs");

async function showFiles(req, res, next) {
  try {
    const folders = await Folder.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    const files = await File.find({
      owner: req.user._id,
      folder: null,
    }).sort({ createdAt: -1 });

    res.render("view", {
      user: req.user,
      folders,
      files,
      currentFolder: null,
    });
  } catch (error) {
    next(error);
  }
}

async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send("Please select a file");
    }

    const file = await File.create({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,

      owner: req.user._id,

      // If uploading inside a folder,
      // save that folder ID.
      folder: req.params.folderId || null,
    });

    console.log("FILE CREATED:", file);

    // If uploaded inside a folder, return to that folder
    if (req.params.folderId) {
      return res.redirect(`/files/folder/${req.params.folderId}`);
    }

    // Otherwise return to root
    res.redirect("/files");
  } catch (error) {
    next(error);
  }
}

// View individual image/PDF
async function viewFile(req, res, next) {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!file) {
      return res.status(404).send("File not found");
    }

    res.set({
      "Content-Type": file.contentType,
      "Content-Length": file.size,
      "Content-Disposition": `inline; filename="${file.filename}"`,
    });

    res.sendFile(path.resolve(file.path));
  } catch (error) {
    next(error);
  }
}

async function deleteFile(req, res, next) {
  try {
    console.log("DELETE REQUEST RECEIVED");
    console.log("FILE ID:", req.params.id);
    console.log("USER ID:", req.user._id);

    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    console.log("FILE FOUND:", file);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    // Delete physical file from uploads folder
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
      console.log("LOCAL FILE DELETED");
    }

    // Delete MongoDB document
    await File.deleteOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    console.log("DATABASE RECORD DELETED");

    return res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    next(error);
  }
}

async function openFolder(req, res, next) {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    const folders = await Folder.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    const files = await File.find({
      owner: req.user._id,
      folder: folder._id,
    }).sort({ createdAt: -1 });

    res.render("view", {
      user: req.user,
      folders,
      files,
      currentFolder: folder,
    });
  } catch (error) {
    next(error);
  }
}
// delete folder
async function deleteFolder(req, res, next) {
  try {
    const folderId = req.params.folderId;

    console.log("DELETE FOLDER REQUEST");
    console.log("FOLDER ID:", folderId);
    console.log("USER ID:", req.user._id);

    // Find folder belonging to logged-in user
    const folder = await Folder.findOne({
      _id: folderId,
      owner: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    // Find all files inside this folder
    const files = await File.find({
      folder: folder._id,
      owner: req.user._id,
    });

    console.log("FILES FOUND:", files.length);

    // Delete physical files
    for (const file of files) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        console.log("PHYSICAL FILE DELETED:", file.path);
      }
    }

    // Delete file records from MongoDB
    await File.deleteMany({
      folder: folder._id,
      owner: req.user._id,
    });

    console.log("FILE RECORDS DELETED");

    // Delete the folder from MongoDB
    await Folder.deleteOne({
      _id: folder._id,
      owner: req.user._id,
    });

    console.log("FOLDER DELETED");

    return res.status(200).json({
      message: "Folder and all files deleted successfully",
    });
  } catch (error) {
    console.error("DELETE FOLDER ERROR:", error);
    next(error);
  }
}

module.exports = {
  showFiles,
  uploadFile,
  viewFile,
  deleteFile,
  openFolder,
  deleteFolder,
};
