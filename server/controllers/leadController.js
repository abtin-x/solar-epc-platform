const path = require("path");
const Lead = require("../models/Lead");

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value || "";
const normalizePhone = (value) =>
  normalizeText(value).replace(/[\s\-().]/g, "");
const VALID_STATUSES = ["new", "contacted", "quoted", "closed"];
const VALID_INQUIRY_TYPES = ["residential", "commercial", "land", "utility"];
const SEARCHABLE_FIELDS = ["contact.fullName", "contact.email", "contact.phone", "contact.country"];

const buildValidationError = (message, errors) => ({
  status: 400,
  success: false,
  message,
  errors,
});

const formatMongooseValidationError = (error) => {
  if (error?.name !== "ValidationError") return null;

  return buildValidationError(
    "Validation failed.",
    Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }))
  );
};

const parseInterestReasons = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const scoreLead = (lead) => {
  let score = 0;

  if (lead.contact.email) score += 10;
  if (lead.contact.phone) score += 10;
  if (lead.contact.country) score += 5;
  if (lead.contact.cityAddress) score += 5;

  if (lead.inquiryType === "residential") {
    if (lead.projectDetails.ownershipStatus === "own") score += 20;
    if (lead.projectDetails.roofShading === "none") score += 15;
    if (Number(lead.projectDetails.monthlyBill) > 100) score += 15;
    if (lead.projectDetails.propertyType) score += 10;
  }

  if (lead.inquiryType === "commercial") {
    if (lead.projectDetails.companyName) score += 15;
    if (lead.projectDetails.facilityType) score += 10;
    if (lead.projectDetails.energyUsage) score += 15;
    if (lead.projectDetails.availableArea) score += 10;
  }

  if (lead.inquiryType === "land") {
    if (lead.projectDetails.landLocation) score += 15;
    if (lead.projectDetails.landSize) score += 15;
    if (lead.projectDetails.gridAccess) score += 10;
  }

  if (lead.inquiryType === "utility") {
    if (lead.projectDetails.organizationName) score += 15;
    if (lead.projectDetails.projectLocation) score += 15;
    if (lead.projectDetails.capacityTarget) score += 15;
    if (lead.projectDetails.tenderStage) score += 10;
  }

  if (lead.attachments.length > 0) score += 15;
  if (lead.message) score += 5;
  if (lead.timeline === "Immediately") score += 15;

  let priority = "low";
  if (score >= 80) priority = "high";
  else if (score >= 50) priority = "medium";

  return { score, priority };
};

const buildLeadData = (body, files = [], req = null) => {
  const publicUploadsEnabled =
    process.env.ENABLE_PUBLIC_UPLOADS !== undefined
      ? process.env.ENABLE_PUBLIC_UPLOADS === "true"
      : (process.env.NODE_ENV || "development") !== "production";
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return {
    inquiryType: normalizeText(body.inquiryType),

    contact: {
      fullName: normalizeText(body.fullName),
      phone: normalizePhone(body.phone),
      email: normalizeText(body.email).toLowerCase(),
      preferredContactMethod: normalizeText(body.preferredContactMethod) || "phone",
      country: normalizeText(body.country),
      cityAddress: normalizeText(body.cityAddress),
    },

    projectDetails: {
      propertyType: normalizeText(body.propertyType),
      ownershipStatus: normalizeText(body.ownershipStatus),
      roofType: normalizeText(body.roofType),
      roofShading: normalizeText(body.roofShading),
      roofAge: normalizeText(body.roofAge),
      monthlyBill: normalizeText(body.monthlyBill),
      electricityProvider: normalizeText(body.electricityProvider),

      companyName: normalizeText(body.companyName),
      facilityType: normalizeText(body.facilityType),
      availableArea: normalizeText(body.availableArea),
      energyUsage: normalizeText(body.energyUsage),

      landLocation: normalizeText(body.landLocation),
      landSize: normalizeText(body.landSize),
      gridAccess: normalizeText(body.gridAccess),
      intendedUse: normalizeText(body.intendedUse),

      organizationName: normalizeText(body.organizationName),
      projectLocation: normalizeText(body.projectLocation),
      capacityTarget: normalizeText(body.capacityTarget),
      tenderStage: normalizeText(body.tenderStage),
    },

    interestReasons: parseInterestReasons(body.interestReasons),
    timeline: normalizeText(body.timeline),
    message: normalizeText(body.message),
    consent: body.consent === "true" || body.consent === true,

    attachments: files.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      filePath: file.path,
      fileUrl: publicUploadsEnabled ? `${baseUrl}/uploads/${path.basename(file.path)}` : "",
      mimeType: file.mimetype,
      size: file.size,
    })),
  };
};

const createLead = async (req, res) => {
  try {
    const leadData = buildLeadData(req.body, req.files, req);
    const { score, priority } = scoreLead(leadData);

    leadData.leadScore = score;
    leadData.priority = priority;

    const newLead = await Lead.create(leadData);

    return res.status(201).json({
      success: true,
      message: "Lead submitted successfully.",
      data: newLead,
    });
  } catch (error) {
    const validationError = formatMongooseValidationError(error);
    if (validationError) {
      return res.status(validationError.status).json(validationError);
    }

    console.error("Create lead error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lead.",
      errors: [],
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const rawLimit = Number.parseInt(req.query.limit, 10);
    const limit = rawLimit ? Math.min(Math.max(rawLimit, 1), 100) : null;
    const status = normalizeText(req.query.status);
    const inquiryType = normalizeText(req.query.inquiryType);
    const search = normalizeText(req.query.search);
    const sort = normalizeText(req.query.sort);

    const query = {};

    if (VALID_STATUSES.includes(status)) {
      query.status = status;
    }

    if (VALID_INQUIRY_TYPES.includes(inquiryType)) {
      query.inquiryType = inquiryType;
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = SEARCHABLE_FIELDS.map((field) => ({ [field]: regex }));
    }

    const sortOptions =
      sort === "oldest"
        ? { createdAt: 1, leadScore: -1 }
        : sort === "priority"
          ? { priority: -1, createdAt: -1 }
          : { createdAt: -1, leadScore: -1 };

    const total = await Lead.countDocuments(query);
    let leadsQuery = Lead.find(query).sort(sortOptions);

    if (limit) {
      leadsQuery = leadsQuery.skip((page - 1) * limit).limit(limit);
    }

    const leads = await leadsQuery;

    return res.status(200).json({
      success: true,
      count: leads.length,
      total,
      data: leads,
      page: limit ? page : 1,
      limit: limit || total,
      totalPages: limit ? Math.max(Math.ceil(total / limit), 1) : 1,
      hasNextPage: limit ? page * limit < total : false,
      hasPrevPage: limit ? page > 1 : false,
    });
  } catch (error) {
    console.error("Get leads error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads.",
    });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const errors = [];
    const updateData = {};

    if (typeof status === "string") {
      const normalizedStatus = normalizeText(status);

      if (!VALID_STATUSES.includes(normalizedStatus)) {
        errors.push({ field: "status", message: "Invalid status." });
      } else {
        updateData.status = normalizedStatus;
      }
    }

    if (typeof adminNotes === "string") {
      const trimmedNotes = adminNotes.trim();

      if (trimmedNotes.length > 5000) {
        errors.push({
          field: "adminNotes",
          message: "Admin notes must be 5000 characters or fewer.",
        });
      } else {
        updateData.adminNotes = trimmedNotes;
      }
    }

    if (!Object.prototype.hasOwnProperty.call(req.body, "status") &&
        !Object.prototype.hasOwnProperty.call(req.body, "adminNotes")) {
      errors.push({
        field: "body",
        message: "At least one updatable field is required.",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json(buildValidationError("Validation failed.", errors));
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      data: updatedLead,
    });
  } catch (error) {
    const validationError = formatMongooseValidationError(error);
    if (validationError) {
      return res.status(validationError.status).json(validationError);
    }

    if (error?.name === "CastError") {
      return res.status(400).json(
        buildValidationError("Validation failed.", [
          { field: "id", message: "Invalid lead id." },
        ])
      );
    }

    console.error("Update lead error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lead.",
      errors: [],
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
};
