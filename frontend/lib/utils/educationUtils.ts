/**
 * Computes Division / Grade label based on Percentage or CGPA string according to Govt standards.
 * Rules:
 * - Percentage (%):
 *     >= 60%       -> "First"
 *     48% - 59.99% -> "Second"
 *     36% - 47.99% -> "Third"
 *     < 36%        -> "Fail"
 * - CGPA:
 *     10.0         -> "First (O)"
 *     9.0 - 9.99   -> "First (A+)"
 *     8.0 - 8.99   -> "First (A)"
 *     7.0 - 7.99   -> "First (B+)"
 *     6.0 - 6.99   -> "First (B)"
 *     5.0 - 5.99   -> "Second (C)"
 *     4.0 - 4.99   -> "Third (P)"
 *     < 4.0        -> "Fail (F)"
 */
export function computeDivisionAndGrade(
  percentageStr?: string | null,
  defaultDivision: string = "",
): string {
  if (!percentageStr) return defaultDivision || "";

  const rawStr = String(percentageStr).trim();
  const upperStr = rawStr.toUpperCase();
  const isCgpa = upperStr.includes("CGPA");

  const match = rawStr.match(/[-+]?\d*\.\d+|\d+/);
  if (!match) return defaultDivision || rawStr;

  const val = parseFloat(match[0]);
  if (isNaN(val)) return defaultDivision || rawStr;

  if (isCgpa || (val <= 10.0 && !rawStr.includes("%"))) {
    const cgpa = val;
    if (cgpa >= 10.0) return "First (O)";
    if (cgpa >= 9.0) return "First (A+)";
    if (cgpa >= 8.0) return "First (A)";
    if (cgpa >= 7.0) return "First (B+)";
    if (cgpa >= 6.0) return "First (B)";
    if (cgpa >= 5.0) return "Second (C)";
    if (cgpa >= 4.0) return "Third (P)";
    return "Fail (F)";
  } else {
    const pct = val;
    if (pct >= 60.0) return "First";
    if (pct >= 48.0) return "Second";
    if (pct >= 36.0) return "Third";
    return "Fail";
  }
}

export function formatPercentageOrCgpa(percentageStr?: string | null): string {
  if (!percentageStr) return "";
  const rawStr = String(percentageStr).trim();
  if (rawStr.includes("%") || rawStr.toUpperCase().includes("CGPA")) {
    return rawStr;
  }

  const match = rawStr.match(/[-+]?\d*\.\d+|\d+/);
  if (!match) return rawStr;

  const val = parseFloat(match[0]);
  if (!isNaN(val) && val > 10.0) {
    return `${rawStr}%`;
  }
  return rawStr;
}
