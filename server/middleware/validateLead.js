const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;
const INQUIRY_TYPES = ["residential", "commercial", "land", "utility"];

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");
const normalizePhone = (value) => normalizeText(value).replace(/[\s\-().]/g, "");

const getRequiredFieldsByInquiry = (inquiryType) => {
  if (inquiryType === "residential") {
    return [
      ["propertyType", "Property type is required."],
      ["ownershipStatus", "Ownership status is required."],
    ];
  }

  if (inquiryType === "commercial") {
    return [
      ["companyName", "Company name is required."],
      ["facilityType", "Facility type is required."],
    ];
  }

  if (inquiryType === "land") {
    return [
      ["landLocation", "Land location is required."],
      ["landSize", "Land size is required."],
    ];
  }

  if (inquiryType === "utility") {
    return [
      ["organizationName", "Organization name is required."],
      ["projectLocation", "Project location is required."],
    ];
  }

  return [];
};

const validateLead = (req, res, next) => {
  const errors = [];
  const fullName = normalizeText(req.body.fullName);
  const phone = normalizePhone(req.body.phone);
  const email = normalizeText(req.body.email).toLowerCase();
  const country = normalizeText(req.body.country);
  const cityAddress = normalizeText(req.body.cityAddress);
  const inquiryType = normalizeText(req.body.inquiryType);
  const consent = req.body.consent === true || req.body.consent === "true";

  if (!fullName) {
    errors.push({ field: "fullName", message: "Full name is required." });
  }

  if (!phone) {
    errors.push({ field: "phone", message: "Phone is required." });
  } else if (!PHONE_REGEX.test(phone)) {
    errors.push({ field: "phone", message: "Invalid phone format." });
  }

  if (!email) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: "email", message: "Invalid email format." });
  }

  if (!country) {
    errors.push({ field: "country", message: "Country is required." });
  }

  if (!cityAddress) {
    errors.push({ field: "cityAddress", message: "Address is required." });
  }

  if (!INQUIRY_TYPES.includes(inquiryType)) {
    errors.push({ field: "inquiryType", message: "Invalid inquiry type." });
  }

  if (!consent) {
    errors.push({ field: "consent", message: "Consent is required." });
  }

  if (INQUIRY_TYPES.includes(inquiryType)) {
    for (const [field, message] of getRequiredFieldsByInquiry(inquiryType)) {
      if (!normalizeText(req.body[field])) {
        errors.push({ field, message });
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};

module.exports = validateLead;
