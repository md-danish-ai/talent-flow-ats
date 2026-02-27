"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Shield, ArrowRight } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Card } from "@components/ui-cards/Card";
import { Button } from "@components/ui-elements/Button";
import Link from "next/link";
import type { CurrentUser } from "@lib/auth/user-utils";
import { getInitials } from "@lib/auth/user-utils";
import { UserDetailView } from "@features/user-details/UserDetailView";
import type { UserDetails } from "@lib/api/user-details";

interface ProfileClientProps {
  user: CurrentUser | null;
  userDetails?: UserDetails | null;
}

export function ProfileClient({ user, userDetails }: ProfileClientProps) {
  if (!user) return null;

  const initials = getInitials(user.username);
  const displayRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  // Use either the passed in userDetails or the recruitment_details from user object
  const recruitmentInfo =
    userDetails || (user.recruitment_details as unknown as UserDetails);

  // Format the "Member since" date
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="mx-auto w-full max-w-7xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <Typography variant="h2" weight="bold" className="mb-2">
            My Profile
          </Typography>
          <Typography variant="body2" className="text-muted-foreground">
            View and manage your personal account information.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Summary */}
          <Card className="md:col-span-1 p-6 h-full border-slate-200 dark:border-zinc-800 shadow-sm transition-all duration-300">
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-brand-primary/10 flex items-center justify-center border-2 border-brand-primary/20 shadow-inner">
                  <Typography
                    variant="h3"
                    weight="black"
                    color="text-brand-primary"
                  >
                    {initials}
                  </Typography>
                </div>

                <div className="flex flex-col gap-1.5 min-w-0">
                  <Typography variant="h4" weight="bold" className="truncate">
                    {user.username}
                  </Typography>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-widest leading-none">
                      {displayRole}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full pt-5 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                  <Calendar size={14} className="opacity-70" />
                  <Typography variant="body5" className="font-medium">
                    Member since {memberSince}
                  </Typography>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Column: Detailed Info */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <Card className="flex-1 p-8 border-slate-200 dark:border-zinc-800 shadow-sm transition-all duration-300">
              <Typography
                variant="h4"
                weight="bold"
                className="mb-6 flex items-center gap-2"
              >
                <User size={20} className="text-brand-primary" />
                Account Information
              </Typography>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <Typography
                    variant="body5"
                    weight="bold"
                    className="text-muted-foreground/60 uppercase tracking-widest"
                  >
                    Full Name
                  </Typography>
                  <Typography
                    variant="body2"
                    weight="semibold"
                    className="text-foreground"
                  >
                    {user.username}
                  </Typography>
                </div>

                <div className="space-y-1.5">
                  <Typography
                    variant="body5"
                    weight="bold"
                    className="text-muted-foreground/60 uppercase tracking-widest"
                  >
                    Account Role
                  </Typography>
                  <Typography
                    variant="body2"
                    weight="semibold"
                    className="text-brand-primary"
                  >
                    {displayRole}
                  </Typography>
                </div>

                <div className="space-y-1.5">
                  <Typography
                    variant="body5"
                    weight="bold"
                    className="text-muted-foreground/60 uppercase tracking-widest"
                  >
                    Email Address
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <Typography
                      variant="body2"
                      weight="semibold"
                      className="text-foreground"
                    >
                      {user.email || "Not provided"}
                    </Typography>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Typography
                    variant="body5"
                    weight="bold"
                    className="text-muted-foreground/60 uppercase tracking-widest"
                  >
                    Mobile Number
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <Typography
                      variant="body2"
                      weight="semibold"
                      className="text-foreground"
                    >
                      {user.mobile || "Not provided"}
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>

            {user.role === "admin" && (
              <Card className="p-8 border-slate-200 dark:border-zinc-800 shadow-sm transition-all duration-300">
                <Typography
                  variant="h4"
                  weight="bold"
                  className="mb-6 flex items-center gap-2"
                >
                  <Shield size={20} className="text-brand-primary" />
                  Administrative Access
                </Typography>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800/50">
                  <Typography
                    variant="body3"
                    className="text-slate-600 dark:text-zinc-400 leading-relaxed"
                  >
                    As an administrator, you have full access to system
                    management, candidate processing, and data analytics tools.
                    Professional settings and system configurations are
                    available in the sidebar.
                  </Typography>
                </div>
              </Card>
            )}
          </div>
        </div>

        {user.role === "user" && (
          <div className="mt-12 pt-12 border-t border-slate-200 dark:border-zinc-800">
            {recruitmentInfo?.personalDetails ? (
              <>
                <Typography
                  variant="h3"
                  weight="bold"
                  className="mb-8 capitalize"
                >
                  Recruitment Progress & Information
                </Typography>
                <UserDetailView
                  details={recruitmentInfo}
                  userId={user.id}
                  hideHeader={true}
                />
              </>
            ) : (
              <Card className="p-12 flex flex-col items-center text-center bg-slate-50/50 dark:bg-zinc-900/30 border-dashed border-2 border-slate-200 dark:border-zinc-800 w-full">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6 mx-auto">
                  <User size={32} className="text-brand-primary" />
                </div>
                <Typography variant="h3" weight="bold" className="mb-3">
                  Profile Incomplete
                </Typography>
                <Typography
                  variant="body2"
                  className="text-muted-foreground max-w-md mb-8"
                >
                  Please update your basic details to see your complete profile
                  and recruitment progress.
                </Typography>
                <Link href="/user/dashboard">
                  <Button
                    variant="outline"
                    color="primary"
                    animate="scale"
                    endIcon={<ArrowRight size={18} />}
                    className="px-10"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
