"use client";

import React from "react";
import { Copy } from "lucide-react";
import { cn } from "@lib/utils";
import { toast } from "@lib/toast";

interface CopyableTextProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  toastMessage?: string;
}

export function CopyableText({
  value,
  children,
  className,
  title = "Copy to clipboard",
  toastMessage,
}: CopyableTextProps) {
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!value || value === "-") return;

    const doCopy = () => {
      toast.success(toastMessage ?? `Copied: ${value}`, {
        title: "Copied to clipboard",
        duration: 2000,
      });
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(value)
        .then(doCopy)
        .catch(() => {
          toast.error("Failed to copy to clipboard.");
        });
    } else {
      // Fallback for non-secure contexts
      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        doCopy();
      } catch (error) {
        console.error(error);
        toast.error("Failed to copy to clipboard.");
      } finally {
        textArea.remove();
      }
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 cursor-pointer hover:text-brand-primary transition-colors group/copy",
        className,
      )}
      onClick={handleCopy}
      title={title}
    >
      {children}
      <button
        className="p-0.5 m-0 bg-transparent border-none focus:outline-none flex items-center justify-center shrink-0"
        tabIndex={-1}
      >
        <Copy
          size={13}
          strokeWidth={2}
          className={cn(
            "text-slate-400 dark:text-slate-500",
            "group-hover/copy:text-brand-primary transition-colors",
          )}
        />
      </button>
    </div>
  );
}
