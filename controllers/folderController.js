const Folder = require("../models/folder");

// CREATE FOLDER
async function createFolder(req, res, next) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).send("Folder name is required");
    }

    const folder = await Folder.create({
      name: name.trim(),
      owner: req.user._id,
      parentFolder: null,
    });

    console.log("FOLDER CREATED:", folder);

    res.redirect("/files");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createFolder,
};
