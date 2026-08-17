const express = require("express");
const Joi = require("joi");

const { signup, login, logout } = require("../controllers/authController");

const validate = require("../middleware/validate");
const rateLimiter = require("../middleware/rateLimiter");

const authRouter = express.Router();

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(4).max(50).required(),

  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

authRouter.get("/signup", (req, res) => {
  res.render("signup");
});

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.post("/signup", validate(signupSchema), signup);

authRouter.post("/login", rateLimiter, validate(loginSchema), login);

module.exports = authRouter;
