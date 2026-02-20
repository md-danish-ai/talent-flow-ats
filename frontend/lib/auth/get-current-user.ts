import { cookies } from "next/headers";
import type { CurrentUser } from "./user-utils";

export type { CurrentUser } from "./user-utils";

/**
 * Server-side utility — reads the logged-in user from the user_info cookie.
 * ⚠️  Server Components and Server Actions ONLY.
 *     Client Components should receive `user` as a prop.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get("user_info")?.value;
    if (raw) {
      return JSON.parse(decodeURIComponent(raw)) as CurrentUser;
    }
  } catch {
    // Malformed or missing cookie
  }
  return null;
}
