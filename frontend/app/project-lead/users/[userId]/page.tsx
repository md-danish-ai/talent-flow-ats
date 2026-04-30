import { UserResultDetailClient } from "../../../admin/results/round-1/[userId]/UserResultDetailClient";

interface ProjectLeadUserResultDetailPageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProjectLeadUserResultDetailPage({
  params,
}: ProjectLeadUserResultDetailPageProps) {
  const resolvedParams = await params;
  return (
    <UserResultDetailClient
      userId={Number(resolvedParams.userId)}
      basePath="/project-lead/users"
    />
  );
}
