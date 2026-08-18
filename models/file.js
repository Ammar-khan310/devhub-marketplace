const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },

    contentType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const File = mongoose.models.File || mongoose.model("File", fileSchema);

module.exports = File;
