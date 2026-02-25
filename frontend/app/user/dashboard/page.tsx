import { DashboardClient } from "./DashboardClient";
import { getCurrentUser } from "@lib/auth/get-current-user";
import { api } from "@lib/api";
import type { CurrentUser } from "@lib/auth/user-utils";
import { cookies } from "next/headers";

export default async function UserDashboard() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  let isDetailsComplete = false;
  let dynamicUser = user;

  const token = cookieStore.get("auth_token")?.value;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const freshUser = await api.get<CurrentUser>("/auth/me", {
      headers: headers as Record<string, string>,
    });

    if (freshUser) {
      dynamicUser = freshUser;
      isDetailsComplete = freshUser.is_submitted;
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }

  return (
    <DashboardClient user={dynamicUser} isDetailsComplete={isDetailsComplete} />
  );
}
