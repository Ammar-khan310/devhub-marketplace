const express = require("express");
const User = require("../models/user");
const adminRouter = express.Router();

adminRouter.get("/users", (req, res) => {
  console.log("dashboard");
  return res.render("admin/dashboard");
});

adminRouter.get("/products", (req, res) => {
  return res.render("admin/products");
});

module.exports = adminRouter;
