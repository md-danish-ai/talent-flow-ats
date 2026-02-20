"use client";

import React from "react";
import Link from "next/link";

interface NavSubItemProps {
  label: string;
  href: string;
  pathname: string;
  onClick?: () => void;
}

/** Single sub-item link inside a collapsible section */
export const NavSubItem: React.FC<NavSubItemProps> = ({
  label,
  href,
  pathname,
  onClick,
}) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group/item ${
        isActive
          ? "text-[#F96331] font-bold bg-orange-50/50"
          : "text-slate-500 hover:text-[#F96331] hover:bg-orange-50/50"
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
          isActive
            ? "bg-[#F96331] scale-110"
            : "bg-slate-300 group-hover/item:bg-[#F96331]"
        }`}
      />
      {label}
    </Link>
  );
};
