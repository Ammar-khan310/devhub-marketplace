const { verifyToken } = require("../utils/jwtHelpers");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/login");
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.redirect("/login");
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.redirect("/login");
  }
}

module.exports = protect;
