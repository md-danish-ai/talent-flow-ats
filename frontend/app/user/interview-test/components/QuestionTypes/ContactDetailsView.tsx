"use client";

import { memo, useState } from "react";
import { Building2, Check, Copy, ExternalLink, Globe } from "lucide-react";
import { Input } from "@components/ui-elements/Input";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { toast } from "@lib/toast";

interface ContactDetailsViewProps {
  questionText: string;
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

const getFormattedUrl = (url: string) => {
  if (!url) return "#";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const ContactDetailsView = memo(function ContactDetailsView({
  questionText,
  currentAnswer,
  onChangeAnswer,
}: ContactDetailsViewProps) {
  const [copied, setCopied] = useState(false);
  const [fieldAnswers, setFieldAnswers] = useState<Record<string, string>>(
    () => {
      try {
        return currentAnswer ? JSON.parse(currentAnswer) : {};
      } catch {
        return {};
      }
    },
  );

  const handleCopy = () => {
    if (!questionText) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(questionText)
        .then(() => {
          setCopied(true);
          toast.success("Target Source / URL copied to clipboard!");
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          toast.error("Failed to copy to clipboard");
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = questionText;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        toast.success("Target Source / URL copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy to clipboard");
      } finally {
        textArea.remove();
      }
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    const updated = { ...fieldAnswers, [key]: value };
    setFieldAnswers(updated);
    onChangeAnswer(JSON.stringify(updated));
  };

  const fields = [
    {
      key: "companyName",
      label: "COMPANY NAME",
      placeholder: "ABC Corporation",
    },
    {
      key: "companyPhoneNumber",
      label: "PHONE NUMBER",
      placeholder: "+1 123-456-7890",
    },
    {
      key: "generalEmail",
      label: "GENERAL EMAIL",
      placeholder: "contact@example.com",
    },
    {
      key: "facebookPage",
      label: "FACEBOOK PAGE",
      placeholder: "https://facebook.com/example",
    },
    {
      key: "streetAddress",
      label: "STREET ADDRESS",
      placeholder: "123 Main St",
    },
    {
      key: "city",
      label: "CITY",
      placeholder: "New York",
    },
    {
      key: "state",
      label: "STATE",
      placeholder: "NY",
    },
    {
      key: "zipCode",
      label: "ZIP CODE",
      placeholder: "10001",
    },
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Header Section */}
      <div className="flex items-center gap-4 group">
        <div
          className={cn(
            "bg-brand-primary/10 p-3 border border-brand-primary/20 group-hover:bg-brand-primary/20 transition-all",
            STYLE_CONFIG.iconRadius,
          )}
        >
          <Globe className="w-5 h-5 text-brand-primary" />
        </div>
        <div className="space-y-0.5">
          <Typography
            variant="h3"
            className="text-foreground font-bold tracking-tight"
          >
            Company Analysis
          </Typography>
          <Typography
            variant="body5"
            className="text-muted-foreground uppercase tracking-[0.12em] font-black leading-none text-[10px]"
          >
            Institutional Data Entry
          </Typography>
        </div>
      </div>

      <div className="space-y-5">
        {/* Source Section */}
        <div
          className={cn(
            "border border-border bg-muted/10 p-1 relative pt-5 shadow-sm",
            STYLE_CONFIG.innerCardRadius,
          )}
        >
          <div
            className={cn(
              "absolute top-0 left-6 -translate-y-1/2 flex items-center gap-2 bg-background px-4 py-1.5 border border-border shadow-sm",
              STYLE_CONFIG.badgeRadius,
            )}
          >
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <Typography
              variant="body4"
              weight="bold"
              className="uppercase tracking-wider text-xs font-bold text-foreground"
            >
              Target Source / URL
            </Typography>
          </div>
          <div className="p-5 flex items-center flex-wrap gap-3">
            {questionText ? (
              <a
                href={getFormattedUrl(questionText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:underline leading-relaxed tracking-tight break-all text-sm transition-colors hover:text-brand-primary/80"
              >
                <span>{questionText}</span>
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
            ) : (
              <Typography
                variant="body2"
                weight="semibold"
                color="text-foreground"
                className="leading-relaxed tracking-tight break-all"
              >
                N/A
              </Typography>
            )}
            {questionText && (
              <button
                type="button"
                onClick={handleCopy}
                title="Copy Target Source / URL"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-border bg-background hover:bg-muted/50 hover:border-brand-primary text-muted-foreground hover:text-brand-primary transition-all cursor-pointer shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Grid Candidate Data Entry */}
      <div
        className={cn(
          "flex flex-col border border-border bg-muted/10 overflow-hidden shadow-sm",
          STYLE_CONFIG.innerCardRadius,
        )}
      >
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/20">
          <Building2 className="w-4 h-4 text-brand-primary" />
          <Typography variant="body3" className="font-bold text-foreground">
            Company Contact Entry
          </Typography>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Typography
                variant="body5"
                weight="black"
                className="uppercase tracking-wider text-[10px] text-muted-foreground/80 block"
              >
                {f.label}
              </Typography>
              <Input
                value={fieldAnswers[f.key] || ""}
                onChange={(e) => handleFieldChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="bg-background border-border hover:border-brand-primary focus:border-brand-primary h-10 font-medium"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
