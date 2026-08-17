const express = require("express");

const fileRouter = express.Router();

const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  showFiles,
  uploadFile,
  viewFile,
} = require("../controllers/fileController");

// view allusers

fileRouter.get("/", protect, showFiles);

// upload page

fileRouter.get("/upload", protect, (req, res) => {
  res.render("upload", {
    user: req.user,
  });
});

// upload image and pdf

fileRouter.post("/upload", protect, upload.single("file"), uploadFile);

// view image pddf

fileRouter.get("/:id", protect, viewFile);

module.exports = fileRouter;
