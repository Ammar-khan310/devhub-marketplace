const express = require("express");

const fileRouter = express.Router();

const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  showFiles,
  uploadFile,
  viewFile,
  deleteFile,
} = require("../controllers/fileController");

const {
  createFolder,
  openFolder,
  deleteFolder,
} = require("../controllers/folderController");

// view all files
fileRouter.get("/", protect, showFiles);

// create folder
fileRouter.post("/folder/create", protect, createFolder);

// open folder
fileRouter.get("/folder/:id", protect, openFolder);
// upload page
fileRouter.get("/upload", protect, (req, res) => {
  res.render("upload", {
    user: req.user,
    folderId: null,
  });
});

// upload page inside folder
fileRouter.get("/upload/:folderId", protect, (req, res) => {
  res.render("upload", {
    user: req.user,
    folderId: req.params.folderId,
  });
});

// upload file root
fileRouter.post("/upload", protect, upload.single("file"), uploadFile);

// upload file inside folder
fileRouter.post(
  "/upload/:folderId",
  protect,
  upload.single("file"),
  uploadFile,
);

// view image/pdf
fileRouter.get("/:id", protect, viewFile);

// delete file
fileRouter.delete("/:id", protect, deleteFile);

// delete folder
fileRouter.delete("/folder/:folderId", protect, deleteFolder);

module.exports = fileRouter;
