"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PaperSetupForm } from "@components/features/paper-setup";
import { papersApi } from "@lib/api/papers";
import { PaperSetupCreate } from "@types";
import { toast } from "@lib/toast";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { PageHeader } from "@components/ui-elements/PageHeader";

export default function CreatePaperPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data: PaperSetupCreate) => {
    setIsLoading(true);
    try {
      await papersApi.createPaper(data);
      toast.success("Paper created successfully");
      router.push("/admin/paper/setup");
    } catch {
      toast.error("Failed to create paper");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer animate>
      <PageHeader
        title="Create New Paper"
        description="Define paper structure, allocate marks, and set timing for a new assessment."
      />

      <div className="mt-6">
        <PaperSetupForm
          title="New Paper Configuration"
          onSubmit={handleCreate}
          onCancel={() => router.push("/admin/paper/setup")}
          isLoading={isLoading}
        />
      </div>
    </PageContainer>
  );
}
