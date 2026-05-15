const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAuthCookieName = () => process.env.AUTH_COOKIE_NAME || "admin_token";

const getAuthCookieOptions = () => {
  const isProduction = (process.env.NODE_ENV || "development") === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (
      !adminEmail ||
      !adminPassword ||
      !jwtSecret ||
      (!adminPassword.startsWith("$2a$") && !adminPassword.startsWith("$2b$"))
    ) {
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured correctly.",
      });
    }

    if (email !== adminEmail) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const passwordMatched = await bcrypt.compare(password, adminPassword);

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: adminEmail,
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    const cookieOptions = {
      ...getAuthCookieOptions(),
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie(getAuthCookieName(), token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      admin: {
        email: adminEmail,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login.",
    });
  }
};

const logoutAdmin = async (req, res) => {
  res.clearCookie(getAuthCookieName(), getAuthCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

module.exports = {
  loginAdmin,
  logoutAdmin,
};
