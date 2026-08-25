/**
 * Converts a snake_case or technical string into a human-readable format.
 * Example: "TYPING_TEST" -> "TYPING TEST"
 */
export const humanizeString = (str?: string): string => {
  if (!str) return "";
  return str.replace(/_/g, " ");
};

/**
 * Capitalizes the first letter of each word in a string.
 * Example: "john doe" -> "John Doe"
 */
export const titleCase = (str?: string): string => {
  if (!str) return "";
  return humanizeString(str)
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Trims leading/trailing whitespace, collapses multiple consecutive spaces,
 * and capitalizes the first letter of each word (Title/Proper Case).
 * Example: "   mohammed    danish   " -> "Mohammed Danish"
 * Example: "b.tech in computer science" -> "B.Tech In Computer Science"
 * Example: "house no 124, street 5" -> "House No 124, Street 5"
 */
export const normalizeProperCase = (val: unknown, fallback = ""): string => {
  if (val === null || val === undefined) return fallback;
  const s = String(val).trim().replace(/\s+/g, " ");
  if (!s) return fallback;
  return s
    .toLowerCase()
    .replace(/(?:^|[\s\-/.([{'"`])([a-z])/g, (match) => match.toUpperCase());
};

/**
 * Trims leading/trailing whitespace and collapses multiple consecutive spaces into a single space.
 * Ideal for names, addresses, descriptions, designations, etc.
 * Example: "   Mohammed    Danish   " -> "Mohammed Danish"
 */
export const normalizeWhitespace = (val: unknown, fallback = ""): string => {
  if (val === null || val === undefined) return fallback;
  const s = String(val).trim().replace(/\s+/g, " ");
  return s || fallback;
};

/**
 * Sanitizes and normalizes an email address (trims whitespace and converts to lowercase).
 * Example: "  User@Example.COM " -> "user@example.com"
 */
export const normalizeEmail = (val: unknown, fallback = ""): string => {
  if (!val) return fallback;
  const s = String(val).trim().toLowerCase();
  return s || fallback;
};

/**
 * Extracts and normalizes a 10-digit mobile number by stripping non-digit characters.
 * Example: "+91 98765 43210" -> "9876543210"
 */
export const normalizeMobile = (val: unknown, fallback = ""): string => {
  if (!val) return fallback;
  const digits = String(val).replace(/\D/g, "").slice(-10);
  return digits || fallback;
};

/**
 * Normalizes a PAN card number (trims whitespace and converts to uppercase).
 * Example: " abcde1234f " -> "ABCDE1234F"
 */
export const normalizePan = (val: unknown, fallback = ""): string => {
  if (!val) return fallback;
  return String(val).trim().toUpperCase() || fallback;
};

/**
 * Normalizes an Aadhaar card number by removing all whitespace and non-digits (up to 12 digits).
 * Example: " 1234 5678 9012 " -> "123456789012"
 */
export const normalizeAadhaar = (val: unknown, fallback = ""): string => {
  if (!val) return fallback;
  return String(val).replace(/\D/g, "").slice(0, 12) || fallback;
};

/**
 * Safely parses boolean values from booleans, numbers, or strings ("yes", "true", "1", "no", "false", "0").
 * Example: "Yes" -> true, "0" -> false
 */
export const parseBoolean = (val: unknown, fallback = false): boolean => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const s = val.trim().toLowerCase();
    if (s === "yes" || s === "true" || s === "1") return true;
    if (s === "no" || s === "false" || s === "0") return false;
  }
  return fallback;
};

// Aliases for compatibility
export const cleanString = normalizeWhitespace;
export const sanitizeString = normalizeWhitespace;
export const cleanMobile = normalizeMobile;
export const cleanEmail = normalizeEmail;
export const cleanPan = normalizePan;
export const cleanAadhaar = normalizeAadhaar;
export const cleanBoolean = parseBoolean;
export const cleanProperCase = normalizeProperCase;
export const toProperCase = normalizeProperCase;
