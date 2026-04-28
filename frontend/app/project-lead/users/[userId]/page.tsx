import { UserResultDetailClient } from "../../../admin/results/[userId]/UserResultDetailClient";

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
