"use client";

import React from "react";
import { Check } from "lucide-react";

const Copy = ({ size, className }: { size: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export const DocCodeBlock = ({
  code,
  onCopy,
  copied,
}: {
  code: string;
  onCopy: () => void;
  copied: boolean;
}) => {
  return (
    <div className="relative group rounded-xl overflow-hidden border border-border bg-slate-950 transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCopy}
            className="text-slate-500 hover:text-brand-primary transition-colors focus:outline-none"
            title="Copy Code"
          >
            {copied ? (
              <Check size={14} className="text-emerald-500" />
            ) : (
              <Copy size={14} className="text-slate-500" />
            )}
          </button>
        </div>
      </div>
      <pre className="p-5 text-[13px] font-mono leading-relaxed overflow-x-auto max-h-[500px]">
        <code className="text-slate-300">
          {code.split("\n").map((line, i) => {
            const escapedLine = line
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");

            const highlighted = escapedLine
              .replace(
                /import|from|export|default|const|let|var|return/g,
                '<span class="text-purple-400">$&</span>',
              )
              .replace(
                /&lt;[A-Z][a-zA-Z]*/g,
                '<span class="text-blue-400">$&</span>',
              )
              .replace(
                /&lt;\/[A-Z][a-zA-Z]*/g,
                '<span class="text-blue-400">$&</span>',
              )
              .replace(/&gt;/g, '<span class="text-blue-400">$&</span>')
              .replace(
                /className|variant|color|size|shadow|animate|onClick|startIcon|endIcon/g,
                '<span class="text-amber-300">$&</span>',
              );

            return (
              <div key={i} className="flex gap-4">
                <span className="inline-block w-4 text-slate-700 select-none text-right">
                  {i + 1}
                </span>
                <span
                  dangerouslySetInnerHTML={{ __html: highlighted || " " }}
                />
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
};
