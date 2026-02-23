import React from "react";
import { MCQClient } from "./MCQClient";

// This simulates a server-side data fetch
async function getMCQQuestions() {
  // In a real application, you would fetch data from your API here
  // const res = await fetch('https://api.example.com/questions', { cache: 'no-store' });
  // return res.json();

  // Mocking server-side data
  const mockData = Array.from({ length: 10 }).map((_, i) => {
    return {
      id: i + 1,
      question: `Sample Multiple Choice Question ${i + 1} for testing the UI layout and scroll behavior.`,
      subject: i % 2 === 0 ? "Industry Awareness" : "Comprehension",
      createdBy: "Danish - Mohammed Danish",
      createdDate: "17/11/2018",
    };
  });

  return {
    data: mockData,
    total: 100,
  };
}

export default async function MCQPage() {
  const { data, total } = await getMCQQuestions();

  return <MCQClient initialData={data} totalItems={total} />;
}
