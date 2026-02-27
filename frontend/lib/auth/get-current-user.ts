import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@lib/api";
import type { CurrentUser } from "./user-utils";

export type { CurrentUser } from "./user-utils";

/**
 * Server-side utility — fetches the logged-in user from the /auth/me endpoint.
 * ⚠️  Server Components and Server Actions ONLY.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) return null;

  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  try {
    const user = await api.get<CurrentUser>("/auth/me", {
      cookies: cookieString,
    });
    return user;
  } catch (error: unknown) {
    const apiError = error as { status?: number };
    if (apiError && apiError.status === 401) {
      // Token expired or invalid — redirect to sign-in
      redirect("/sign-in");
    }
    console.error("Error fetching current user:", error);
    return null;
  }
}
