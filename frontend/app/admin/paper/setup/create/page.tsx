"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PaperSetupForm } from "@components/features/paper-setup";
import { papersApi, PaperSetupCreate } from "@lib/api/papers";
import { toast } from "@lib/toast";
import { PageContainer } from "@components/ui-layout/PageContainer";

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
      <PaperSetupForm
        onSubmit={handleCreate}
        onCancel={() => router.push("/admin/paper/setup")}
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
