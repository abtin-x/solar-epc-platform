const express = require("express");
const router = express.Router();

const { upload, maxFileCount } = require("../middleware/upload");
const validateLead = require("../middleware/validateLead");
const requireAdminAuth = require("../middleware/authMiddleware");

const {
  createLead,
  getLeads,
  updateLeadStatus,
} = require("../controllers/leadController");

router.post("/", upload.array("attachments", maxFileCount), validateLead, createLead);

router.get("/", requireAdminAuth, getLeads);
router.patch("/:id", requireAdminAuth, updateLeadStatus);

module.exports = router;
