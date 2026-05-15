const jwt = require("jsonwebtoken");

const requireAdminAuth = (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured correctly.",
      });
    }

    const cookieName = process.env.AUTH_COOKIE_NAME || "admin_token";
    const token = req.cookies?.[cookieName] || null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid or expired token.",
    });
  }
};

module.exports = requireAdminAuth;
