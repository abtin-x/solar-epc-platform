const mongoose = require("mongoose");

const INQUIRY_TYPES = ["residential", "commercial", "land", "utility"];
const CONTACT_METHODS = ["phone", "email"];
const PRIORITIES = ["low", "medium", "high", "normal"];
const STATUSES = ["new", "contacted", "quoted", "closed"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

const trimmedString = (maxLength, extra = {}) => ({
  type: String,
  trim: true,
  maxlength: maxLength,
  default: "",
  ...extra,
});

const AttachmentSchema = new mongoose.Schema(
  {
    originalName: trimmedString(255),
    fileName: trimmedString(255),
    filePath: trimmedString(500),
    fileUrl: trimmedString(500),
    mimeType: trimmedString(100),
    size: { type: Number, default: 0 },
  },
  { _id: false }
);

const LeadSchema = new mongoose.Schema(
  {
    inquiryType: {
      ...trimmedString(32),
      required: [true, "Inquiry type is required."],
      enum: {
        values: ["", ...INQUIRY_TYPES],
        message: "Invalid inquiry type.",
      },
    },

    contact: {
      fullName: {
        ...trimmedString(120),
        required: [true, "Full name is required."],
      },
      phone: {
        ...trimmedString(20),
        required: [true, "Phone is required."],
        validate: {
          validator: (value) => !value || PHONE_REGEX.test(value),
          message: "Invalid phone format.",
        },
      },
      email: {
        ...trimmedString(254, { lowercase: true }),
        required: [true, "Email is required."],
        validate: {
          validator: (value) => !value || EMAIL_REGEX.test(value),
          message: "Invalid email format.",
        },
      },
      preferredContactMethod: {
        ...trimmedString(16, { default: "phone" }),
        enum: {
          values: CONTACT_METHODS,
          message: "Invalid preferred contact method.",
        },
      },
      country: {
        ...trimmedString(80),
        required: [true, "Country is required."],
      },
      cityAddress: {
        ...trimmedString(200),
        required: [true, "Address is required."],
      },
    },

    projectDetails: {
      propertyType: trimmedString(40),
      ownershipStatus: trimmedString(20),
      roofType: trimmedString(20),
      roofShading: trimmedString(20),
      roofAge: trimmedString(60),
      monthlyBill: trimmedString(60),
      electricityProvider: trimmedString(120),

      companyName: trimmedString(120),
      facilityType: trimmedString(40),
      availableArea: trimmedString(80),
      energyUsage: trimmedString(80),

      landLocation: trimmedString(160),
      landSize: trimmedString(80),
      gridAccess: trimmedString(120),
      intendedUse: trimmedString(40),

      organizationName: trimmedString(120),
      projectLocation: trimmedString(160),
      capacityTarget: trimmedString(80),
      tenderStage: trimmedString(120),
    },

    interestReasons: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => Array.isArray(value) && value.length <= 10,
        message: "Too many interest reasons.",
      },
    },
    timeline: trimmedString(40),
    message: trimmedString(2000),
    consent: { type: Boolean, default: false, required: [true, "Consent is required."] },

    attachments: {
      type: [AttachmentSchema],
      default: [],
    },

    leadScore: { type: Number, default: 0, min: 0, max: 100 },
    priority: {
      ...trimmedString(16, { default: "normal" }),
      enum: {
        values: PRIORITIES,
        message: "Invalid priority.",
      },
    },
    status: {
      ...trimmedString(16, { default: "new" }),
      enum: {
        values: STATUSES,
        message: "Invalid status.",
      },
    },

    adminNotes: trimmedString(5000),
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ inquiryType: 1 });
LeadSchema.index({ priority: 1 });
LeadSchema.index({ "contact.email": 1 });
LeadSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
