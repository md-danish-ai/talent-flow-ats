import { DashboardClient } from "./DashboardClient";
import { getCurrentUser } from "@lib/auth/get-current-user";
import { api } from "@lib/api";
import { getUserDetailsById } from "@lib/api/user-details";
import type { CurrentUser } from "@lib/auth/user-utils";
import { cookies } from "next/headers";

export default async function UserDashboard() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  let isDetailsComplete = false;
  let dynamicUser = user;

  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join(";");

  try {
    // 1. Get current user profile from /auth/me
    const freshUser = await api.get<CurrentUser>("/auth/me", {
      cookies: cookieString,
    });

    if (freshUser) {
      dynamicUser = freshUser;

      // 2. Fetch specific recruitment details by ID from the dedicated endpoint
      try {
        const details = await getUserDetailsById(freshUser.id, {
          cookies: cookieString,
        });
        if (details && details.is_submitted) {
          isDetailsComplete = true;
        }
      } catch (detailsError) {
        console.warn("Recruitment details not found for user:", detailsError);
        // If not found, isDetailsComplete remains false
      }
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }

  return (
    <DashboardClient user={dynamicUser} isDetailsComplete={isDetailsComplete} />
  );
}
