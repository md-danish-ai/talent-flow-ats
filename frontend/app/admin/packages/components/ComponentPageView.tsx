"use client";

import React, { useState } from "react";
import { Sparkles, Code2 } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { DocCodeBlock } from "./DocCodeBlock";

interface ComponentPageViewProps {
  title: string;
  description: string;
  children: React.ReactNode;
  code: string;
  fullSource?: string;
  usageExample?: string;
}

export const ComponentPageView = ({
  title,
  description,
  children,
  code,
  fullSource,
  usageExample,
}: ComponentPageViewProps) => {
  const [copied, setCopied] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSource || code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-5xl pt-4 relative">
      <header className="mb-10 relative">
        <div className="flex items-center gap-2 text-brand-primary mb-2">
          <Sparkles size={16} />
          <Typography
            variant="body5"
            weight="black"
            className="uppercase tracking-[0.2em]"
          >
            Component Documentation
          </Typography>
        </div>
        <Typography
          variant="h1"
          weight="black"
          className="text-4xl text-foreground tracking-tight mb-4 font-outfit"
        >
          {title}
        </Typography>
        <div className="absolute top-0 right-0 p-2 bg-brand-primary/10 backdrop-blur rounded-lg border border-brand-primary/20 text-[9px] font-black text-brand-primary uppercase tracking-[0.15em] pointer-events-none z-10 select-none">
          Live Preview
        </div>
        <Typography
          variant="body2"
          className="text-muted-foreground leading-relaxed max-w-3xl"
        >
          {description}
        </Typography>
      </header>

      <div className="space-y-16">
        <section>
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm mb-6">
            <div className="p-12 flex items-center justify-center bg-muted/20 dark:bg-slate-900/40 relative group min-h-[300px]">
              {children}
            </div>
            <div className="px-6 py-3 border-t border-border bg-muted/10 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-bold gap-2 hover:bg-brand-primary/10 hover:text-brand-primary transition-all"
                onClick={() => setIsCodeVisible(!isCodeVisible)}
              >
                <Code2 size={14} />
                {isCodeVisible ? "Hide Code" : "Show Code"}
              </Button>
            </div>
          </div>

          {isCodeVisible && (
            <div className="max-w-4xl animate-in fade-in slide-in-from-top-2 duration-300">
              <DocCodeBlock
                code={fullSource || code}
                onCopy={handleCopy}
                copied={copied}
              />
            </div>
          )}
        </section>

        {usageExample && (
          <section className="space-y-6">
            <div className="border-l-4 border-brand-primary pl-6">
              <Typography
                variant="h3"
                weight="bold"
                className="text-foreground"
              >
                Implementation Details
              </Typography>
              <Typography
                variant="body3"
                className="text-muted-foreground mt-1"
              >
                Advanced usage patterns and configuration examples.
              </Typography>
            </div>
            <div className="max-w-4xl">
              <DocCodeBlock
                code={usageExample}
                onCopy={() => {}}
                copied={false}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
