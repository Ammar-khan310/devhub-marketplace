const express = require("express");
const User = require("../models/User");
const adminRouter = express.Router();

adminRouter.get("/", async (req, res) => {
  const allUsers = await User.find({});
  return res.render("admin/dashboard", {
    allUser: allUsers,
  });
});

module.exports = adminRouter;
