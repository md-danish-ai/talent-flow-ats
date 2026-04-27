import { getCurrentUser } from "@lib/auth/get-current-user";
import ProjectLeadUsersClient from "./ProjectLeadUsersClient";

export default async function ProjectLeadUsersPage() {
  const user = await getCurrentUser();

  return <ProjectLeadUsersClient leadId={Number(user?.id || 0)} />;
}
