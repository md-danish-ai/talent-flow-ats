"use client";

import React from "react";

interface AnimatedCollapsibleProps {
  isOpen: boolean;
  children: React.ReactNode;
}

/** Smooth height-animated collapsible wrapper using the CSS grid-rows trick */
export const AnimatedCollapsible: React.FC<AnimatedCollapsibleProps> = ({
  isOpen,
  children,
}) => (
  <div
    className={`grid transition-all duration-300 ease-in-out ${
      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
    }`}
  >
    <div className="overflow-hidden min-h-0">
      <div className="pl-6 space-y-1 pt-1 pb-1">{children}</div>
    </div>
  </div>
);
