import EvaluationClient from "./EvaluationClient";

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  
  return <EvaluationClient userId={parseInt(userId)} />;
}
