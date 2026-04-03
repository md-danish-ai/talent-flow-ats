"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  },
};

export function ProfileClient({ user, userDetails }: ProfileClientProps) {
  if (!user) return null;

  const initials = getInitials(user.username);
  const displayRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  const recruitmentInfo =
    userDetails || (user.recruitment_details as unknown as UserDetails);

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="mx-auto w-full max-w-7xl pb-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* Profile Header Block */}
        <motion.div variants={itemVariants} className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-secondary/5 blur-3xl -z-10 h-64 opacity-50" />

          <div className="flex flex-col md:flex-row items-center md:items-center gap-8 pb-8 border-b border-slate-200 dark:border-zinc-800">
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                <Typography
                  variant="h1"
                  weight="black"
                  className="text-3xl text-brand-primary"
                >
                  {initials}
                </Typography>
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-xl bg-green-500 border-4 border-white dark:border-zinc-900 flex items-center justify-center z-20 shadow-lg">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <Typography
                  variant="h2"
                  weight="black"
                  className="tracking-tight leading-none text-3xl"
                >
                  {user.username}
                </Typography>
                <div className="flex justify-center md:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-widest leading-none">
                    {displayRole} Account
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-slate-500 dark:text-zinc-500">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Mail size={16} className="text-brand-primary/60" />
                  {user.email}
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Calendar size={16} className="text-brand-primary/60" />
                  Member since {memberSince}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/user/dashboard">
                <Button
                  variant="outline"
                  color="primary"
                  size="sm"
                  className="rounded-xl px-6 py-4 font-bold text-xs uppercase tracking-widest"
                >
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="space-y-12">
          {/* Access Control - Horizontal Row Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:ring-1 dark:ring-zinc-800/50 rounded-[2.5rem] overflow-hidden relative group transition-all duration-500 hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_30px_70px_rgba(0,0,0,0.7)]">
              <div className="absolute -top-12 -right-12 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 -z-10">
                <Shield size={240} />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="space-y-6">
                  <Typography
                    variant="h5"
                    weight="black"
                    className="flex items-center gap-3 uppercase tracking-tighter"
                  >
                    <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <Shield size={20} />
                    </div>
                    Access Control & Security
                  </Typography>
                  <Typography
                    variant="body4"
                    weight="bold"
                    className="text-slate-600 dark:text-zinc-400 max-w-md leading-relaxed"
                  >
                    Your account is currently fully verified and protected.
                    Administrative and user privileges are managed through this
                    node.
                  </Typography>
                </div>

                <div className="flex flex-wrap gap-10 md:pr-10">
                  <div className="space-y-4">
                    <InfoField
                      label="Registered Phone"
                      value={user.mobile || "Not linked"}
                      icon={<Phone size={14} />}
                    />
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 w-fit">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <Typography
                        variant="body5"
                        weight="black"
                        className="text-green-600 dark:text-green-500 uppercase tracking-widest text-[9px]"
                      >
                        Authenticated
                      </Typography>
                    </div>
                  </div>

                  {user.role === "admin" && (
                    <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                        <Shield size={20} />
                      </div>
                      <div>
                        <Typography
                          variant="body5"
                          weight="black"
                          className="text-indigo-400 uppercase tracking-widest text-[9px] mb-1 block"
                        >
                          Access Level
                        </Typography>
                        <Typography
                          variant="body3"
                          weight="black"
                          className="text-indigo-900 dark:text-indigo-300 uppercase"
                        >
                          Root Admin
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Main Content Area - Career Progress */}
          <motion.div variants={itemVariants}>
            {user.role === "user" && (
              <div className="space-y-12">
                {recruitmentInfo?.personalDetails ? (
                  <div className="space-y-10">
                    <div className="flex items-center gap-4">
                      <div className="h-[3px] w-12 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)]" />
                      <Typography
                        variant="h3"
                        weight="black"
                        className="tracking-tighter uppercase text-2xl font-black italic"
                      >
                        Academics & Career Progress
                      </Typography>
                    </div>
                    <UserDetailView
                      details={recruitmentInfo}
                      userId={user.id}
                      hideHeader={true}
                    />
                  </div>
                ) : (
                  <Card className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 dark:bg-zinc-900/30 border-dashed border-2 border-slate-200 dark:border-zinc-800 rounded-[3rem] group">
                    <div className="w-24 h-24 rounded-[3rem] bg-amber-500/10 flex items-center justify-center mb-10 mx-auto relative">
                      <Lock
                        size={40}
                        className="text-amber-600 group-hover:scale-110 transition-transform duration-500"
                      />
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute inset-0 rounded-[3rem] bg-amber-500/20 -z-10"
                      />
                    </div>
                    <Typography
                      variant="h3"
                      weight="black"
                      className="mb-4 text-3xl tracking-tighter uppercase font-black"
                    >
                      Journey Locked
                    </Typography>
                    <Typography
                      variant="body2"
                      weight="medium"
                      className="text-slate-500 dark:text-zinc-500 max-w-sm mb-12 leading-relaxed text-lg"
                    >
                      Your recruitment trail is currently hidden. Complete your
                      profile details to unlock your future.
                    </Typography>
                    <Link href="/user/dashboard">
                      <Button
                        variant="primary"
                        animate="scale"
                        endIcon={<ArrowRight size={18} />}
                        className="px-16 py-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-primary/30"
                      >
                        Launch Dashboard
                      </Button>
                    </Link>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Typography
        variant="body5"
        weight="bold"
        className="text-slate-400 dark:text-zinc-600 uppercase tracking-widest text-[9px]"
      >
        {label}
      </Typography>
      <div className="flex items-center gap-3 group/field">
        <div className="text-brand-primary/40 group-hover/field:text-brand-primary transition-colors">
          {icon}
        </div>
        <Typography
          variant="body2"
          weight="bold"
          className="text-slate-900 dark:text-zinc-100 truncate"
        >
          {value}
        </Typography>
      </div>
    </div>
  );
}
