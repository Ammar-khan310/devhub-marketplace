const File = require("../models/file");

// Show all files belonging to logged-in user
async function showFiles(req, res, next) {
  try {
    const files = await File.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.render("view", {
      user: req.user,
      files: files,
    });
  } catch (error) {
    next(error);
  }
}

// Upload image or PDF
async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send("Please select an image or PDF");
    }

    const file = await File.create({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
      owner: req.user._id,
    });

    console.log("File saved:", file._id);

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

    res.send(file.data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  showFiles,
  uploadFile,
  viewFile,
};
