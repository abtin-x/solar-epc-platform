require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL || "*";
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const enablePublicUploads =
  process.env.ENABLE_PUBLIC_UPLOADS !== undefined
    ? process.env.ENABLE_PUBLIC_UPLOADS === "true"
    : !isProduction;

const startupErrors = [];

if (!MONGO_URI) {
  startupErrors.push("MONGO_URI is required.");
}

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  startupErrors.push("JWT_SECRET is required and should be at least 32 characters long.");
}

if (!ADMIN_EMAIL) {
  startupErrors.push("ADMIN_EMAIL is required.");
}

if (!ADMIN_PASSWORD) {
  startupErrors.push("ADMIN_PASSWORD is required.");
} else if (!ADMIN_PASSWORD.startsWith("$2a$") && !ADMIN_PASSWORD.startsWith("$2b$")) {
  startupErrors.push("ADMIN_PASSWORD must be a bcrypt hash.");
}

if (isProduction && (!CLIENT_URL || CLIENT_URL === "*")) {
  startupErrors.push("CLIENT_URL must be set to an explicit origin in production.");
}

if (startupErrors.length > 0) {
  console.error("Startup configuration error(s):");
  startupErrors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

const uploadPath = path.join(__dirname, UPLOAD_DIR);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(helmet());

app.use(
  cors({
    origin: CLIENT_URL === "*" && !isProduction ? true : CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
      success: false,
      message: "Too many login attempts. Please try again later.",
    },
  })
);

if (enablePublicUploads) {
  app.use("/uploads", express.static(uploadPath));
}

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: [
        {
          field: "attachments",
          message: err.message,
        },
      ],
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong.",
    errors: Array.isArray(err.errors) ? err.errors : [],
  });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });
