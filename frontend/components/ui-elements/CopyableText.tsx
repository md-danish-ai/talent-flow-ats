"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@lib/utils";

interface CopyableTextProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function CopyableText({
  value,
  children,
  className,
  title = "Copy to clipboard",
}: CopyableTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!value || value === "-") return;
    
    // Fallback for document.execCommand if clipboard API isn't available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      // move it out of sight
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 cursor-pointer hover:text-brand-primary transition-colors group/copy",
        className
      )}
      onClick={handleCopy}
      title={title}
    >
      {children}
      <button 
        className="p-0.5 m-0 bg-transparent border-none focus:outline-none flex items-center justify-center shrink-0"
        tabIndex={-1}
      >
        {copied ? (
          <Check size={13} strokeWidth={3} className="text-emerald-500" />
        ) : (
          <Copy 
            size={13} 
            strokeWidth={2}
            className={cn(
              "text-slate-400 dark:text-slate-500",
              "group-hover/copy:text-brand-primary transition-colors"
            )} 
          />
        )}
      </button>
    </div>
  );
}
