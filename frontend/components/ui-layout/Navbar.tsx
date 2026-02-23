"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NotificationDropdown } from "@components/ui-elements/NotificationDropdown";
import { ProfileDropdown } from "@components/ui-elements/ProfileDropdown";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { useSidebar } from "./sidebar";
import type { CurrentUser } from "@lib/auth/user-utils";
import { ThemeToggle } from "@components/ui-elements/ThemeToggle";
import { useRipple, RippleContainer } from "@components/ui-elements/Ripple";

interface NavbarProps {
  user: CurrentUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const { ripples, createRipple, removeRipple } = useRipple();
  const { toggleSidebar } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications] = useState([]); // Empty notifications for now

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-background border-b border-transparent h-[73px] flex items-center transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="relative overflow-hidden flex items-center gap-2 text-[var(--color-brand-primary)] px-3 py-1.5 rounded-xl transition-all hover:bg-brand-primary/5"
              onClick={createRipple}
            >
              <div className="relative z-10 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src="/bg.png"
                  alt="ArcInterview"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <Typography
                variant="body1"
                weight="bold"
                as="span"
                className="relative z-10 text-foreground tracking-tight hidden sm:block"
              >
                ArcInterview
              </Typography>
              <RippleContainer
                ripples={ripples}
                onRemove={removeRipple}
                color="bg-brand-primary/10"
              />
            </Link>

            <Button
              variant="ghost"
              color="default"
              size="icon-sm"
              className="min-[900px]:hidden"
              onClick={toggleSidebar}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div ref={notificationsRef}>
              <NotificationDropdown
                isOpen={isNotificationsOpen}
                onToggle={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                notifications={notifications}
              />
            </div>

            <div ref={dropdownRef}>
              <ProfileDropdown
                user={user}
                isOpen={isProfileOpen}
                onToggle={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
