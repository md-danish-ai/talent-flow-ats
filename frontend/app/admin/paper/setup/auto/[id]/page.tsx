import React from "react";
import { AutoAssignClient } from "@/app/admin/paper/setup/auto/[id]/AutoAssignClient";

export default async function AutoAssignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <AutoAssignClient id={parseInt(resolvedParams.id)} />;
}
