import { getCurrentUser } from "@lib/auth/get-current-user";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { UserListing } from "./components/UserListing";

export default async function ProjectLeadUsersPage() {
  const user = await getCurrentUser();
  const leadId = Number(user?.id || 0);

  return (
    <PageContainer className="space-y-6" animate>
      <UserListing leadId={leadId} />
    </PageContainer>
  );
}
