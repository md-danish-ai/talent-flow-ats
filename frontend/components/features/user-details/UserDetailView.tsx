"use client";

import React from "react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
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
} from "lucide-react";
import Link from "next/link";
import type { UserDetails } from "@lib/api/user-details";

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
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
      {/* Header Info */}
      {!hideHeader && (
        <div className="bg-card border ring-1 ring-border rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <User size={40} />
            </div>
            <div>
              <Typography variant="h3" weight="bold" className="capitalize">
                {personalDetails?.firstName} {personalDetails?.lastName}
              </Typography>
              <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1.5 text-sm">
                  <Mail size={14} /> {personalDetails?.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <Phone size={14} /> {personalDetails?.primaryMobile}
                </span>
              </div>
            </div>
          </div>
          <Link href={`/admin/user-management/update-details/${userId}`}>
            <Button
              variant="primary"
              animate="scale"
              startIcon={<Pencil size={18} />}
            >
              Edit Profile
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Personal & Other */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <MainCard
            title={
              <span className="flex items-center gap-2">
                <Info size={20} /> Personal Information
              </span>
            }
          >
            <div className="space-y-4">
              <DetailItem label="Gender" value={personalDetails?.gender} />
              <DetailItem label="Date of Birth" value={personalDetails?.dob} />
              <DetailItem
                label="Alternate Mobile"
                value={personalDetails?.alternateMobile || "-"}
              />
              <div className="pt-4 border-t">
                <Typography
                  variant="body5"
                  weight="semibold"
                  className="text-muted-foreground uppercase mb-2"
                >
                  Present Address
                </Typography>
                <p className="text-sm leading-relaxed">
                  {personalDetails?.presentAddressLine1}
                  <br />
                  {personalDetails?.presentCity},{" "}
                  {personalDetails?.presentDistrict}
                  <br />
                  {personalDetails?.presentState} -{" "}
                  {personalDetails?.presentPincode}
                </p>
              </div>
              <div className="pt-4 border-t">
                <Typography
                  variant="body5"
                  weight="semibold"
                  className="text-muted-foreground uppercase mb-2"
                >
                  Permanent Address
                </Typography>
                <p className="text-sm leading-relaxed">
                  {personalDetails?.sameAddress ? (
                    "Same as present address"
                  ) : (
                    <>
                      {personalDetails?.permanentAddressLine1}
                      <br />
                      {personalDetails?.permanentCity},{" "}
                      {personalDetails?.permanentDistrict}
                      <br />
                      {personalDetails?.permanentState} -{" "}
                      {personalDetails?.permanentPincode}
                    </>
                  )}
                </p>
              </div>
            </div>
          </MainCard>

          <MainCard
            title={
              <span className="flex items-center gap-2">
                <FileText size={20} /> Other Details
              </span>
            }
          >
            <div className="space-y-4">
              <DetailItem
                label="Service Commitment"
                value={otherDetails?.serviceCommitment}
              />
              <DetailItem
                label="Security Deposit"
                value={otherDetails?.securityDeposit}
              />
              <DetailItem label="Shift Time" value={otherDetails?.shiftTime} />
              <DetailItem
                label="Expected Joining"
                value={otherDetails?.expectedJoiningDate}
              />
              <DetailItem
                label="Expected Salary"
                value={
                  otherDetails?.expectedSalary
                    ? `₹${otherDetails.expectedSalary}`
                    : "-"
                }
              />
            </div>
          </MainCard>
        </div>

        {/* Right Column - Family, Education, Work */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Work Experience */}
          <MainCard
            title={
              <span className="flex items-center gap-2">
                <Briefcase size={20} /> Work Experience
              </span>
            }
          >
            <div className="space-y-6">
              {!workExperienceDetails?.length ||
              workExperienceDetails[0].company === "" ? (
                <p className="text-sm text-muted-foreground italic">
                  No work experience added.
                </p>
              ) : (
                workExperienceDetails
                  .filter((w) => w.company)
                  .map((work, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 border-l-2 border-brand-primary/20 pb-2"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-primary border-4 border-card"></div>
                      <Typography variant="body2" weight="bold">
                        {work.company}
                      </Typography>
                      <Typography
                        variant="body4"
                        className="text-brand-primary font-medium"
                      >
                        {work.designation}
                      </Typography>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground italic">
                        <span>
                          {work.joinDate} to {work.relieveDate || "Present"}
                        </span>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Reason:
                        </span>{" "}
                        {work.reason}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Salary:
                        </span>{" "}
                        ₹{work.salary}
                      </p>
                    </div>
                  ))
              )}
            </div>
          </MainCard>

          {/* Education */}
          <MainCard
            title={
              <span className="flex items-center gap-2">
                <GraduationCap size={20} /> Education Background
              </span>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left pb-3 font-semibold">Level</th>
                    <th className="text-left pb-3 font-semibold">
                      School/College
                    </th>
                    <th className="text-left pb-3 font-semibold">Board/Univ</th>
                    <th className="text-left pb-3 font-semibold">Year</th>
                    <th className="text-left pb-3 font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {educationDetails
                    .filter((e) => e.school)
                    .map((edu, idx) => (
                      <tr key={idx}>
                        <td className="py-3 font-medium">{edu.type}</td>
                        <td className="py-3">{edu.school}</td>
                        <td className="py-3">{edu.board}</td>
                        <td className="py-3">{edu.year}</td>
                        <td className="py-3">
                          {edu.percentage} ({edu.division})
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </MainCard>

          {/* Family Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MainCard
              title={
                <span className="flex items-center gap-2">
                  <UsersIcon size={20} /> Family Details
                </span>
              }
            >
              <div className="space-y-3">
                {familyDetails
                  .filter((f) => f.name)
                  .map((fam, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm border-b border-dashed pb-2 last:border-0"
                    >
                      <span className="text-muted-foreground">
                        {fam.relationLabel}:
                      </span>
                      <span className="font-medium">{fam.name}</span>
                    </div>
                  ))}
              </div>
            </MainCard>

            <MainCard
              title={
                <span className="flex items-center gap-2">
                  <MapPin size={20} /> Information Source
                </span>
              }
            >
              <div className="space-y-4">
                <DetailItem
                  label="Interviewed Before"
                  value={sourceOfInformation?.interviewedBefore}
                />
                <DetailItem
                  label="Worked Before"
                  value={sourceOfInformation?.workedBefore}
                />
                <div className="pt-2">
                  <Typography
                    variant="body5"
                    weight="semibold"
                    className="text-muted-foreground uppercase mb-2"
                  >
                    Sources
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {sourceOfInformation?.source &&
                      Object.entries(sourceOfInformation.source)
                        .filter(([, value]) => value === true)
                        .map(([key]) => (
                          <span
                            key={key}
                            className="px-2 py-1 bg-muted rounded text-[10px] uppercase font-bold text-muted-foreground"
                          >
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                        ))}
                  </div>
                </div>
              </div>
            </MainCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Typography
        variant="body5"
        weight="semibold"
        className="text-muted-foreground uppercase"
      >
        {label}
      </Typography>
      <Typography variant="body3" weight="medium">
        {value || "-"}
      </Typography>
    </div>
  );
}
