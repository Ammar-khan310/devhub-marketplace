const folderService = require("../services/folderService");

async function createFolder(req, res, next) {
  try {
    await folderService.createFolder({
      name: req.body.name,
      userId: req.user._id,
    });

    res.redirect("/files");
  } catch (error) {
    next(error);
  }
}

async function openFolder(req, res, next) {
  try {
    const { folder, folders, files } =
      await folderService.openFolder(
        req.params.id,
        req.user._id
      );

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

async function deleteFolder(req, res, next) {
  try {
    await folderService.deleteFolder(
      req.params.folderId,
      req.user._id
    );

    return res.status(200).json({
      message: "Folder and all files deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createFolder,
  openFolder,
  deleteFolder,
};