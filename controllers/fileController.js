const path = require("path");

const fileService = require("../services/fileService");

async function showFiles(req, res, next) {
  try {
    const { folders, files } = await fileService.showFiles(
      req.user._id
    );

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
    await fileService.uploadFile({
      file: req.file,
      userId: req.user._id,
      folderId: req.params.folderId,
    });

    if (req.params.folderId) {
      return res.redirect(
        `/files/folder/${req.params.folderId}`
      );
    }

    res.redirect("/files");
  } catch (error) {
    next(error);
  }
}

async function viewFile(req, res, next) {
  try {
    const file = await fileService.viewFile(
      req.params.id,
      req.user._id
    );

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
    await fileService.deleteFile(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  showFiles,
  uploadFile,
  viewFile,
  deleteFile,
};