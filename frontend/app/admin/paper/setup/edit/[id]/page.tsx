"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PaperSetupForm } from "@components/features/paper-setup";
import { papersApi } from "@lib/api/papers";
import { PaperSetup, PaperSetupCreate } from "@types";
import { toast } from "@lib/toast";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { PaperFormSkeleton } from "@components/ui-skeleton/PaperFormSkeleton";

export default function EditPaperPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id ? Number(params.id) : null;

  const [paper, setPaper] = useState<PaperSetup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) return;
      try {
        const data = await papersApi.getPaperById(id);
        setPaper(data);
      } catch (error) {
        console.error("Failed to fetch paper:", error);
        toast.error("Failed to load paper details");
        router.push("/admin/paper/setup");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaper();
  }, [id, router]);

  const handleUpdate = async (data: PaperSetupCreate) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await papersApi.updatePaper(id, data);
      toast.success("Paper updated successfully");
      router.push("/admin/paper/setup");
    } catch {
      toast.error("Failed to update paper");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer animate>
        <PaperFormSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer animate>
      {paper && (
        <PaperSetupForm
          title="Edit Paper Configuration"
          initialData={paper}
          onSubmit={handleUpdate}
          onCancel={() => router.push("/admin/paper/setup")}
          isLoading={isSubmitting}
        />
      )}
    </PageContainer>
  );
}
