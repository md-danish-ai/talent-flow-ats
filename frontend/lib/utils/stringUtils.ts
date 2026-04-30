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
 */
export const titleCase = (str?: string): string => {
  if (!str) return "";
  return humanizeString(str)
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
