import { getCurrentUser } from "@lib/auth/get-current-user";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { ProjectLeadUserListing } from "./components/ProjectLeadUserListing";

export default async function ProjectLeadUsersPage() {
  const user = await getCurrentUser();
  const leadId = Number(user?.id || 0);

  return (
    <PageContainer className="space-y-6 max-w-7xl mx-auto" animate>
      <div className="flex flex-col gap-1">
        <Typography variant="h2" className="font-black tracking-tight">
          Assigned Users
        </Typography>
        <Typography variant="body4" className="text-muted-foreground">
          Manage and evaluate users assigned to you for Round 2 interviews.
        </Typography>
      </div>

      <ProjectLeadUserListing leadId={leadId} />
    </PageContainer>
  );
}
