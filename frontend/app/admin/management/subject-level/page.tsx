import React from "react";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

import { TypesManagementClient } from "./TypesManagementClient";
import { classificationsApi } from "lib/api/classifications";

// This simulates server-side data fetching for both types
async function getTypesData() {
  try {
    const cookieStore = await cookies();
    const cookieStr = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const [subjectsResponse, levelsResponse] = await Promise.all([
      classificationsApi.getClassifications(
        { type: "subject", page: 1, limit: 10 },
        { cookies: cookieStr },
      ),
      classificationsApi.getClassifications(
        { type: "exam_level", page: 1, limit: 10 },
        { cookies: cookieStr },
      ),
    ]);

    return {
      subjectsResponse,
      levelsResponse,
    };
  } catch (error) {
    console.error("Error fetching types data:", error);
    return { subjectsResponse: null, levelsResponse: null };
  }
}

export default async function TypesManagementPage() {
  const { subjectsResponse, levelsResponse } = await getTypesData();

  return (
    <TypesManagementClient
      initialSubjectData={subjectsResponse || undefined}
      initialLevelData={levelsResponse || undefined}
    />
  );
}
