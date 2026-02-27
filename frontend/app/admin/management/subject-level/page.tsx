import React from "react";
import { TypesManagementClient } from "./TypesManagementClient";

// This simulates server-side data fetching for both types
async function getTypesData() {
    const subjectTypes = [
        { id: 1, name: "Technical", description: "Core technical knowledge and skills." },
        { id: 2, name: "Aptitude", description: "Logical reasoning and quantitative skills." },
        { id: 3, name: "Soft Skills", description: "Communication and interpersonal skills." },
    ];

    const levelTypes = [
        { id: 1, name: "Fresher", description: "Entry-level candidates with 0-1 year of experience." },
        { id: 2, name: "QA", description: "Quality Assurance professionals." },
        { id: 3, name: "Team Lead", description: "Experienced professionals leading technical teams." },
    ];

    return { subjectTypes, levelTypes };
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
