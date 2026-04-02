import { DashboardClient } from "./DashboardClient";
import { getCurrentUser } from "@lib/auth/get-current-user";
import { getUserDetailsById } from "@lib/api/user-details";
import { cookies } from "next/headers";

export default async function UserDashboard() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  let isDetailsComplete = false;
  let isInterviewSubmitted = false;

  if (user) {
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join(";");

    try {
      // Fetch specific recruitment details by ID from the dedicated endpoint
      const details = await getUserDetailsById(user.id, {
        cookies: cookieString,
      });
      if (details) {
        isDetailsComplete = details.is_submitted || false;
        isInterviewSubmitted = details.is_interview_submitted || false;
      }
    } catch (detailsError) {
      console.warn("Recruitment details not found for user:", detailsError);
      // If not found, flags remain false
    }
  }

  return (
    <DashboardClient
      user={user}
      isDetailsComplete={isDetailsComplete}
      isInterviewSubmitted={isInterviewSubmitted}
    />
  );
}
