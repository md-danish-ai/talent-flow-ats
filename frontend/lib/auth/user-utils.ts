/**
 * Shared user types and pure utilities.
 * Safe to import in BOTH Server and Client Components — no server-only APIs here.
 */

export interface CurrentUser {
  id: number | string;
  username: string;
  role: string;
  is_submitted: boolean;
  recruitment_details?: Record<string, unknown> | null;
}

/** Returns 1–2 uppercase initials from a display name. */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
