"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getInitials } from "@lib/auth/user-utils";
import type { CurrentUser } from "@lib/auth/user-utils";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { motion, AnimatePresence } from "framer-motion";
import { useRipple, RippleContainer } from "@components/ui-elements/Ripple";

interface ProfileDropdownProps {
  user: CurrentUser | null;
  isOpen: boolean;
  onToggle: () => void;
}

const ProfileMenuLink = ({
  href,
  onClick,
  children,
  icon,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => {
  const { ripples, createRipple, removeRipple } = useRipple();

  return (
    <Link
      href={href}
      className="relative overflow-hidden flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-brand-primary/5 hover:text-brand-primary transition-all group"
      onClick={(e) => {
        createRipple(e);
        onClick();
      }}
    >
      <div className="relative z-10 w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-background transition-colors shrink-0">
        {icon}
      </div>
      <Typography variant="body4" weight="semibold" className="relative z-10">
        {children}
      </Typography>
      <RippleContainer
        ripples={ripples}
        onRemove={removeRipple}
        color="bg-brand-primary/10"
      />
    </Link>
  );
};

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  isOpen,
  onToggle,
}) => {
  const router = useRouter();

  // Derived display values — fall back gracefully if cookie not yet parsed
  const displayName = user?.username ?? "User";
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Guest";
  const initials = user?.username ? getInitials(user.username) : "?";

  const logout = () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie =
      "user_info=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/sign-in");
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        color="default"
        size="icon"
        className="group p-1 outline-none"
        onClick={onToggle}
      >
        <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-brand-primary/10 transition-all shadow-sm select-none">
          <Typography
            variant="body4"
            weight="extrabold"
            color="text-brand-primary"
          >
            {initials}
          </Typography>
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="absolute right-0 mt-3 w-64 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden py-1 origin-top-right transition-colors"
          >
            <div className="px-4 py-4 border-b border-border bg-muted/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm shrink-0 select-none overflow-hidden">
                <Typography
                  variant="body3"
                  weight="black"
                  color="text-brand-primary"
                >
                  {initials}
                </Typography>
              </div>
              <div className="min-w-0">
                <Typography
                  variant="body3"
                  weight="bold"
                  className="text-foreground leading-tight truncate"
                >
                  {displayName}
                </Typography>
                <Typography
                  variant="body5"
                  weight="semibold"
                  className="text-brand-primary mt-0.5 uppercase tracking-wide"
                >
                  {displayRole}
                </Typography>
              </div>
            </div>

            <div className="px-3 py-2">
              <Typography
                variant="body5"
                weight="bold"
                className="text-muted-foreground/60 uppercase tracking-widest px-3 py-1.5"
              >
                Settings
              </Typography>
              <ProfileMenuLink
                href="/admin/profile"
                onClick={onToggle}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
              >
                My Profile
              </ProfileMenuLink>

              <div className="border-t border-border my-1 pt-1">
                <Button
                  variant="ghost"
                  color="error"
                  className="w-full flex items-center justify-start gap-3 px-3 py-2 text-sm font-bold"
                  onClick={() => {
                    logout();
                    onToggle();
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
