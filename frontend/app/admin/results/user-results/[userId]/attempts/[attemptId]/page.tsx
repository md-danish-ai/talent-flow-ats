import { AttemptDetailClient } from "./AttemptDetailClient";

interface AttemptDetailPageProps {
  params: Promise<{ userId: string; attemptId: string }>;
}

export default async function AttemptDetailPage({
  params,
}: AttemptDetailPageProps) {
  const resolvedParams = await params;
  return (
    <AttemptDetailClient
      userId={Number(resolvedParams.userId)}
      attemptId={Number(resolvedParams.attemptId)}
    />
  );
}
