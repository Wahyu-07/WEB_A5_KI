const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ success: false, message: "Token required" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // berisi id + username
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
