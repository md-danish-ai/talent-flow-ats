import React from "react";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

import { TypesManagementClient } from "./TypesManagementClient";
import { classificationsApi, Classification } from "@/lib/api/classifications";

// This simulates server-side data fetching for both types
async function getTypesData() {
    try {
        const cookieStore = await cookies();
        const cookieStr = cookieStore
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; ");

        const [subjectsResponse, levelsResponse] = await Promise.all([
            classificationsApi.getClassifications({ type: "subject", limit: 100 }, { cookies: cookieStr }),
            classificationsApi.getClassifications({ type: "exam_level", limit: 100 }, { cookies: cookieStr })
        ]);

        return {
            subjectTypes: subjectsResponse.data.map((item: Classification) => ({
                id: item.id,
                name: item.name,
                description: (item.metadata?.description as string) || "",
                is_active: item.is_active
            })),
            levelTypes: levelsResponse.data.map((item: Classification) => ({
                id: item.id,
                name: item.name,
                description: (item.metadata?.description as string) || "",
                is_active: item.is_active
            }))
        };
    } catch (error) {
        console.error("Error fetching types data:", error);
        return { subjectTypes: [], levelTypes: [] };
    }
}

export default async function TypesManagementPage() {
    const { subjectTypes, levelTypes } = await getTypesData();

    return (
        <TypesManagementClient
            initialSubjectData={subjectTypes}
            initialLevelData={levelTypes}
        />
    );
}
