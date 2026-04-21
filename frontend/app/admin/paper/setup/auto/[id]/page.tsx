import React from "react";
import { AutoAssignClient } from "./AutoAssignClient";

export default async function AutoAssignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <AutoAssignClient id={parseInt(resolvedParams.id)} />;
}
