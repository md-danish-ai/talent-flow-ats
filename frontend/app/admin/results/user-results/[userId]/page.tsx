import { UserResultDetailClient } from "./UserResultDetailClient";

interface UserResultDetailPageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserResultDetailPage({
  params,
}: UserResultDetailPageProps) {
  const resolvedParams = await params;
  return <UserResultDetailClient userId={Number(resolvedParams.userId)} />;
}
