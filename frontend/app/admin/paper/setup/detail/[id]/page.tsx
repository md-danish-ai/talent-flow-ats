"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { PaperSetupDetail } from "../../components/PaperSetupDetail";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { PageHeader } from "@components/ui-elements/PageHeader";

export default function DetailPaperPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id ? Number(params.id) : null;

  return (
    <PageContainer animate>
      <PageHeader
        title="Paper Configuration Details"
        description="In-depth overview of the paper structure, subject distribution, and assigned questions."
      />

      <div className="mt-6">
        {id && (
          <PaperSetupDetail
            paperId={id}
            onBack={() => router.push("/admin/paper/setup")}
          />
        )}
      </div>
    </PageContainer>
  );
}
