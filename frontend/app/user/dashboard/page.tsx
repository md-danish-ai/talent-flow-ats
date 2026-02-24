import { DashboardClient } from "./DashboardClient";
import { getCurrentUser } from "@lib/auth/get-current-user";

export default async function UserDashboard() {
  const user = await getCurrentUser();
  return <DashboardClient user={user} />;
}
