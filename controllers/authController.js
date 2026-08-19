const authService = require("../services/authService");

async function signup(req, res, next) {
  try {
    await authService.signup(req.body);

    res.redirect("/login");
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const token = await authService.login(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("/files");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
};