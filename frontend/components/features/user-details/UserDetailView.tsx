"use client";

import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Users as UsersIcon,
  Info,
  Pencil,
  FileText,
  Calendar,
  Clock,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import type { UserDetails } from "@lib/api/user-details";
import { Card } from "@components/ui-cards/Card";

interface UserDetailViewProps {
  details: UserDetails;
  userId: string | number;
  hideHeader?: boolean;
}

export function UserDetailView({
  details,
  userId,
  hideHeader = false,
}: UserDetailViewProps) {
  const {
    personalDetails,
    familyDetails = [],
    educationDetails = [],
    workExperienceDetails = [],
    otherDetails,
    sourceOfInformation,
  } = details;

  if (!personalDetails) return null;

  return (
    <div className="flex flex-col gap-10 w-full mx-auto">
      {/* Header Info */}
      {!hideHeader && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border-4 border-brand-primary/5 shadow-inner">
              <User size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <Typography
                variant="h2"
                weight="black"
                className="capitalize tracking-tight"
              >
                {personalDetails?.firstName} {personalDetails?.lastName}
              </Typography>
              <div className="flex flex-wrap gap-5 text-slate-500 dark:text-zinc-500">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Mail size={16} className="text-brand-primary/60" />
                  {personalDetails?.email}
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Phone size={16} className="text-brand-primary/60" />
                  {personalDetails?.primaryMobile}
                </span>
              </div>
            </div>
          </div>
          <Link href={`/admin/management/users/update-details/${userId}`}>
            <Button
              variant="primary"
              animate="scale"
              startIcon={<Pencil size={18} />}
              className="rounded-2xl px-8 py-5 h-auto font-black text-xs uppercase tracking-widest"
            >
              Update Profile
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Bio Section - Usually important info */}
        <div className="md:col-span-1">
          <SectionCard
            title="Bio Data"
            icon={<Info size={20} />}
            bgIcon={Info}
            accentColor="bg-brand-primary"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Gender" value={personalDetails?.gender} />
                <DetailItem label="DOB" value={personalDetails?.dob} />
              </div>
              <DetailItem
                label="Alternate Contact"
                value={personalDetails?.alternateMobile || "—"}
              />

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                <div className="space-y-2">
                  <Typography
                    variant="body5"
                    weight="black"
                    className="text-slate-400 uppercase tracking-tighter text-[10px]"
                  >
                    Present Address
                  </Typography>
                  <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-zinc-300">
                    {personalDetails?.presentAddressLine1},{" "}
                    {personalDetails?.presentCity},{" "}
                    {personalDetails?.presentDistrict},{" "}
                    {personalDetails?.presentState} —{" "}
                    {personalDetails?.presentPincode}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Logistics Section */}
        <div className="md:col-span-1">
          <SectionCard
            title="Logistics"
            icon={<FileText size={20} />}
            bgIcon={FileText}
            accentColor="bg-indigo-500"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  label="Service Commitment"
                  value={otherDetails?.serviceCommitment}
                  icon={<Clock size={14} />}
                />
                <DetailItem
                  label="Security Deposit"
                  value={otherDetails?.securityDeposit}
                  icon={<Shield size={14} />}
                />
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                <DetailItem
                  label="Shift Preference"
                  value={otherDetails?.shiftTime}
                  icon={<Calendar size={14} />}
                />
              </div>
              <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                <DetailItem
                  label="Joining"
                  value={otherDetails?.expectedJoiningDate}
                />
                <DetailItem
                  label="Exp. Salary"
                  value={
                    otherDetails?.expectedSalary
                      ? `₹${otherDetails.expectedSalary}`
                      : "—"
                  }
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Work Experience - Needs more width */}
        <div className="md:col-span-2">
          <SectionCard
            title="Experience Trail"
            icon={<Briefcase size={20} />}
            bgIcon={Briefcase}
            accentColor="bg-blue-500"
          >
            <div className="space-y-8">
              {!workExperienceDetails?.length ||
              workExperienceDetails[0].company === "" ? (
                <EmptyState message="No professional history documented yet." />
              ) : (
                workExperienceDetails
                  .filter((w) => w.company)
                  .map((work, idx) => (
                    <div
                      key={idx}
                      className="group/work relative pl-8 border-l-2 border-slate-100 dark:border-zinc-800 pb-2 hover:border-blue-500 transition-colors"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 group-hover/work:bg-blue-500 transition-colors shadow-sm" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="body1"
                            weight="black"
                            className="tracking-tight uppercase"
                          >
                            {work.company}
                          </Typography>
                          <Typography
                            variant="body3"
                            weight="bold"
                            className="text-blue-600 dark:text-blue-400"
                          >
                            {work.designation}
                          </Typography>
                        </div>
                        <div className="px-3 py-1 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-100 dark:border-zinc-700 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {work.joinDate} — {work.relieveDate || "Present"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-zinc-950/20 border border-slate-100 dark:border-zinc-800/50">
                          <Typography
                            variant="body5"
                            weight="black"
                            className="text-slate-400 uppercase tracking-tighter text-[9px] mb-1 block"
                          >
                            Departure Reason
                          </Typography>
                          <Typography
                            variant="body4"
                            className="text-slate-600 dark:text-zinc-400 italic"
                          >
                            &quot;{work.reason || "N/A"}&quot;
                          </Typography>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50/20 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20">
                          <Typography
                            variant="body5"
                            weight="black"
                            className="text-blue-400 uppercase tracking-tighter text-[9px] mb-1 block"
                          >
                            Last Package
                          </Typography>
                          <Typography
                            variant="body3"
                            weight="black"
                            className="text-blue-700 dark:text-blue-300"
                          >
                            ₹{work.salary}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </SectionCard>
        </div>

        {/* Education - Full Width too to avoid squished table */}
        <div className="md:col-span-2">
          <SectionCard
            title="Academic Credentials"
            icon={<GraduationCap size={20} />}
            bgIcon={GraduationCap}
            accentColor="bg-amber-500"
          >
            <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-zinc-800">
              <table className="w-full text-sm border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/50 text-slate-400 dark:text-zinc-500">
                    <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                      Level
                    </th>
                    <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                      Institution
                    </th>
                    <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                      Board
                    </th>
                    <th className="text-center px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                      Year
                    </th>
                    <th className="text-right px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {educationDetails
                    .filter((e) => e.school)
                    .map((edu, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                      >
                        <td className="px-6 py-5 font-black text-xs text-brand-primary uppercase">
                          {edu.type}
                        </td>
                        <td className="px-6 py-5 font-bold">{edu.school}</td>
                        <td className="px-6 py-5 text-slate-500">
                          {edu.board}
                        </td>
                        <td className="px-6 py-5 text-center font-bold">
                          {edu.year}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 font-black text-[11px] text-slate-700 dark:text-zinc-300">
                            {edu.percentage}%{" "}
                            <span className="opacity-40 font-medium">
                              {edu.division}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Bottom Grid: Family & Source */}
        <div className="md:col-span-1">
          <SectionCard
            title="Family Ties"
            icon={<UsersIcon size={20} />}
            bgIcon={UsersIcon}
            accentColor="bg-rose-500"
          >
            <div className="space-y-4">
              {familyDetails
                .filter((f) => f.name)
                .map((fam, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-slate-50/50 dark:bg-zinc-950/20 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800/50"
                  >
                    <div className="flex flex-col">
                      <Typography
                        variant="body5"
                        weight="black"
                        className="text-rose-400 uppercase tracking-tighter text-[9px]"
                      >
                        {fam.relationLabel}
                      </Typography>
                      <Typography variant="body3" weight="bold">
                        {fam.name}
                      </Typography>
                    </div>
                    <div className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-lg text-[10px] font-bold text-slate-400">
                      {fam.occupation || "N/A"}
                    </div>
                  </div>
                ))}
            </div>
          </SectionCard>
        </div>

        <div className="md:col-span-1">
          <SectionCard
            title="Acquisition"
            icon={<MapPin size={20} />}
            bgIcon={MapPin}
            accentColor="bg-teal-500"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  label="Previous Interview"
                  value={
                    sourceOfInformation?.interviewedBefore === "yes"
                      ? "Yes, Previously"
                      : "No"
                  }
                />
                <DetailItem
                  label="Past Employment"
                  value={
                    sourceOfInformation?.workedBefore === "yes"
                      ? "Yes, Previously"
                      : "No"
                  }
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                <Typography
                  variant="body5"
                  weight="black"
                  className="text-slate-400 uppercase tracking-widest text-[10px] mb-3 block"
                >
                  Discovery Channels
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {sourceOfInformation?.source &&
                    Object.entries(sourceOfInformation.source)
                      .filter(([, value]) => value === true)
                      .map(([key]) => (
                        <span
                          key={key}
                          className="px-3 py-1.5 bg-teal-500/10 dark:bg-teal-500/20 rounded-xl text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 border border-teal-500/20"
                        >
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                      ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
  accentColor,
  bgIcon: BgIcon,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accentColor: string;
  bgIcon?: React.ElementType;
}) {
  return (
    <Card className="h-full bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-slate-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-sm dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] dark:ring-1 dark:ring-zinc-800/50 hover:shadow-md dark:hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-500 relative overflow-hidden group">
      <div
        className={`absolute top-0 left-0 w-1.5 h-full ${accentColor} opacity-20`}
      />

      {BgIcon && (
        <div className="absolute -top-12 -right-12 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rotate-12 -z-0 pointer-events-none">
          <BgIcon size={220} strokeWidth={1} />
        </div>
      )}

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div
          className={`h-10 w-10 rounded-xl ${accentColor}/10 flex items-center justify-center text-slate-600 dark:text-zinc-400`}
        >
          {icon}
        </div>
        <Typography
          variant="h4"
          weight="black"
          className="uppercase tracking-widest text-[13px] text-slate-800 dark:text-zinc-200"
        >
          {title}
        </Typography>
      </div>
      <div className="relative z-10">{children}</div>
    </Card>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Typography
        variant="body5"
        weight="black"
        className="text-slate-400 uppercase tracking-tighter text-[9px]"
      >
        {label}
      </Typography>
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-300">{icon}</span>}
        <Typography
          variant="body3"
          weight="bold"
          className="text-slate-900 dark:text-zinc-100"
        >
          {value || "—"}
        </Typography>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 opacity-40">
      <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-300 mb-3 flex items-center justify-center">
        <Typography variant="body1" className="text-slate-300">
          ?
        </Typography>
      </div>
      <Typography variant="body4" className="italic">
        {message}
      </Typography>
    </div>
  );
}
