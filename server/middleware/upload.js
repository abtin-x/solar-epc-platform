const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirName = process.env.UPLOAD_DIR || "uploads";
const uploadDir = path.join(__dirname, "..", uploadDirName);
const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
const maxFileCount = Number(process.env.MAX_FILE_COUNT || 5);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_");
    const normalizedBase = safeBase.replace(/_+/g, "_").slice(0, 80) || "file";

    cb(null, `${Date.now()}-${normalizedBase}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const originalName = file.originalname || "";

  if (!allowedExtensions.includes(extension) || !allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error("Only PDF, JPG, JPEG, PNG, and WEBP files are allowed.");
    error.status = 400;
    error.errors = [
      {
        field: "attachments",
        message: "Only PDF, JPG, JPEG, PNG, and WEBP files are allowed.",
      },
    ];
    return cb(error);
  }

  if (originalName.length > 255) {
    const error = new Error("Attachment filename is too long.");
    error.status = 400;
    error.errors = [
      {
        field: "attachments",
        message: "Attachment filename is too long.",
      },
    ];
    return cb(error);
  }

  cb(null, true);
};

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 10);

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSizeMb * 1024 * 1024,
    files: maxFileCount,
  },
});

module.exports = {
  upload,
  maxFileCount,
};
