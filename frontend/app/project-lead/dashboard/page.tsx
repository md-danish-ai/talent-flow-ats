import { getCurrentUser } from "@lib/auth/get-current-user";
import ProjectLeadDashboardClient from "./ProjectLeadDashboardClient";

export default async function ProjectLeadDashboardPage() {
  const user = await getCurrentUser();

  return <ProjectLeadDashboardClient leadId={Number(user?.id || 0)} />;
}
