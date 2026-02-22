"use client";

import React from "react";
import { Code2 } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";
import { CATEGORIES } from "../data/documentation";
import { useRipple, RippleContainer } from "@components/ui-elements/Ripple";

interface DocSidebarProps {
  activeItem: string;
  onSelect: (id: string) => void;
}

const DocNavItem = ({
  item,
  activeItem,
  onSelect,
}: {
  item: { id: string; name: string };
  activeItem: string;
  onSelect: (id: string) => void;
}) => {
  const { ripples, createRipple, removeRipple } = useRipple();

  return (
    <button
      onClick={(e) => {
        createRipple(e);
        onSelect(item.id);
      }}
      className={cn(
        "relative overflow-hidden w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group flex items-center justify-between",
        activeItem === item.id
          ? "text-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20 shadow-sm ring-1 ring-brand-primary/20"
          : "text-slate-600 dark:text-slate-400 hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 hover:text-brand-primary",
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{item.name}</span>
      <RippleContainer
        ripples={ripples}
        onRemove={removeRipple}
        color="bg-brand-primary/10"
      />
    </button>
  );
};

export const DocSidebar = ({ activeItem, onSelect }: DocSidebarProps) => (
  <aside className="w-80 flex flex-col bg-card/60 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm h-full hidden md:flex transition-all duration-500">
    <div className="p-6 pb-2 shrink-0">
      <div className="flex items-center gap-3 text-brand-primary p-2">
        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-sm">
          <Code2 size={24} />
        </div>
        <div>
          <Typography
            variant="body4"
            weight="black"
            className="tracking-tight text-foreground font-outfit"
          >
            CORE UI
          </Typography>
          <Typography
            variant="body5"
            className="text-muted-foreground text-[9px] font-black uppercase tracking-widest opacity-50"
          >
            Design Portal
          </Typography>
        </div>
      </div>
    </div>

    <nav className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth custom-scrollbar">
      {CATEGORIES.map((cat, index) => (
        <div key={cat.id} className={cn(index !== 0 && "mt-8")}>
          <Typography
            variant="body5"
            weight="black"
            className="text-muted-foreground uppercase tracking-[0.2em] mb-3 block px-3 text-[10px] opacity-60"
          >
            {cat.name}
          </Typography>
          <ul className="space-y-1">
            {cat.items.map((item) => (
              <li key={item.id}>
                <DocNavItem
                  item={item}
                  activeItem={activeItem}
                  onSelect={onSelect}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  </aside>
);
