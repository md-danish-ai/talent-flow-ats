import { DashboardClient } from "./DashboardClient";
import { getCurrentUser } from "@lib/auth/get-current-user";
import { getUserDetailsById } from "@lib/api/user-details";
import { interviewAttemptsApi } from "@lib/api/interview-attempts";
import { cookies } from "next/headers";

export default async function UserDashboard() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  let isDetailsComplete = false;
  let isInterviewSubmitted = false;
  let activeInterviewStatus: {
    has_attempt: boolean;
    status: string | null;
    is_expired: boolean;
    attempt_id?: number | null;
  } = {
    has_attempt: false,
    status: null,
    is_expired: false,
  };

  if (user) {
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join(";");

    try {
      // 1. Fetch recruitment details
      const details = await getUserDetailsById(user.id, {
        cookies: cookieString,
      });
      if (details) {
        isDetailsComplete = details.is_submitted || false;
        isInterviewSubmitted = details.is_interview_submitted || false;
      }

      // 2. Fetch active interview status
      const statusRes = await interviewAttemptsApi.getActiveStatus({
        cookies: cookieString,
      });
      activeInterviewStatus = statusRes;
    } catch (detailsError) {
      console.warn(
        "Recruitment details or active status info not found:",
        detailsError,
      );
      // Fallback to default flags
    }
  }

  return (
    <DashboardClient
      user={user}
      isDetailsComplete={isDetailsComplete}
      isInterviewSubmitted={isInterviewSubmitted}
      activeInterviewStatus={activeInterviewStatus}
    />
  );
}
