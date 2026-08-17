const express = require("express");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});

// app.post("/login", loginLimiter, loginController);

module.exports = loginLimiter;
