"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { toast } from "@lib/toast";
import { BASE_URL } from "@lib/api/client";

export async function downloadReportPdf(
  userId: number,
  attemptId: number,
  username: string,
  mobile?: string,
): Promise<void> {
  const authRow = document.cookie
    .split(";")
    .find((r) => r.trim().startsWith("auth_token="));
  let token = authRow ? authRow.trim().substring("auth_token=".length) : "";
  token = token.replace(/^"|"$/g, "").replace(/^%22|%22$/g, "");
  try {
    token = decodeURIComponent(token);
  } catch {
    /* keep raw */
  }

  const res = await fetch(
    `${BASE_URL}/admin/results/report/${userId}/${attemptId}/pdf`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error("PDF generation failed");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const contentDisposition = res.headers.get("content-disposition");
  let filename = "";
  if (contentDisposition) {
    const match = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  if (!filename) {
    const safeName = username ? username.replace(/\s+/g, "_") : "Candidate";
    const cleanMobile = mobile
      ? String(mobile).replace(/\D/g, "").slice(-10)
      : "";
    filename = cleanMobile
      ? `${safeName}_${cleanMobile}.pdf`
      : `${safeName}.pdf`;
  }

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface DownloadReportIconButtonProps {
  userId: number;
  attemptId?: number | null;
  username: string;
  mobile?: string;
  disabled?: boolean;
  btnSize?: "sm" | "md";
}

export function DownloadReportIconButton({
  userId,
  attemptId,
  username,
  mobile,
  disabled = false,
  btnSize = "sm",
}: DownloadReportIconButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!attemptId) {
    return (
      <TableIconButton
        iconColor="violet"
        btnSize={btnSize}
        animate="scale"
        title="No Test Attempted"
        disabled
      >
        <Download size={16} />
      </TableIconButton>
    );
  }

  return (
    <TableIconButton
      iconColor="violet"
      btnSize={btnSize}
      animate="scale"
      title="Download Report Sheet"
      disabled={disabled || loading}
      onClick={async (e) => {
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        try {
          await downloadReportPdf(userId, attemptId, username, mobile);
        } catch {
          toast.error("Failed to download report. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Download size={16} />
      )}
    </TableIconButton>
  );
}
