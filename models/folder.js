const mongoose = require("mongoose");
const createFolderValidation = require("../validation/foldervalidation");

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      createFolderValidation: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Folder = mongoose.models.Folder || mongoose.model("Folder", folderSchema);

module.exports = Folder;
