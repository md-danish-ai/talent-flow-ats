"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Users as UsersIcon,
  Pencil,
  FileText,
  Calendar,
  Shield,
  Fingerprint,
  CreditCard,
  Compass,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import type { UserDetails } from "@types";
import { motion } from "framer-motion";
import { cn, formatDateDDMMYYYY } from "@lib/utils";

interface UserDetailViewProps {
  details: UserDetails;
  userId: string | number;
  hideHeader?: boolean;
  backUrl?: string;
}

const TIMELINE_STEPS = [
  {
    id: "personal",
    step: 1,
    title: "Personal Details",
    icon: User,
    color: "text-brand-primary",
  },
  {
    id: "identity",
    step: 2,
    title: "Identity & Demographics",
    icon: Fingerprint,
    color: "text-violet-500",
  },
  {
    id: "family",
    step: 3,
    title: "Family Details",
    icon: UsersIcon,
    color: "text-rose-500",
  },
  {
    id: "source",
    step: 4,
    title: "Source of Information",
    icon: Compass,
    color: "text-teal-500",
  },
  {
    id: "education",
    step: 5,
    title: "Education Details",
    icon: GraduationCap,
    color: "text-amber-500",
  },
  {
    id: "experience",
    step: 6,
    title: "Work Experience",
    icon: Briefcase,
    color: "text-blue-500",
  },
  {
    id: "others",
    step: 7,
    title: "Other Details & Preferences",
    icon: FileText,
    color: "text-indigo-500",
  },
];

export function UserDetailView({
  details,
  userId,
  hideHeader = false,
  backUrl,
}: UserDetailViewProps) {
  const {
    personalDetails,
    additionalPersonalDetails,
    familyDetails = [],
    educationDetails = [],
    workExperienceDetails = [],
    otherDetails,
    sourceOfInformation,
    department_name,
    test_level_name,
  } = details;

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const fillLineRef = useRef<HTMLDivElement>(null);
  const targetHeightRef = useRef<number>(0);
  const currentHeightRef = useRef<number>(0);

  const [totalSpanPx, setTotalSpanPx] = useState<number>(0);
  const [node1OffsetTop, setNode1OffsetTop] = useState<number>(24);
  const [activeSteps, setActiveSteps] = useState<number[]>([1]);

  // 60/120fps Smooth Physics Interpolation Loop (RAF + LERP)
  useEffect(() => {
    const container = timelineContainerRef.current;
    if (!container) return;

    // Detect actual scrolling parent container (<main overflow-y-auto> or window)
    const findScrollParent = (
      node: HTMLElement | null,
    ): HTMLElement | Window => {
      if (!node) return window;
      let parent = node.parentElement;
      while (parent) {
        const { overflowY } = window.getComputedStyle(parent);
        if (overflowY === "auto" || overflowY === "scroll") {
          return parent;
        }
        parent = parent.parentElement;
      }
      return window;
    };

    const scrollParent = findScrollParent(container);
    let animationFrameId: number;
    let isRunning = true;

    // Animation Loop: Silky Smooth Linear Interpolation
    const animate = () => {
      if (!isRunning) return;

      const diff = targetHeightRef.current - currentHeightRef.current;
      if (Math.abs(diff) > 0.1) {
        currentHeightRef.current += diff * 0.16; // 0.16 easing constant for fluid glide
      } else {
        currentHeightRef.current = targetHeightRef.current;
      }

      if (fillLineRef.current) {
        fillLineRef.current.style.height = `${currentHeightRef.current}px`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleScroll = () => {
      if (!timelineContainerRef.current) return;
      const currentContainer = timelineContainerRef.current;
      const containerRect = currentContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const node1El = document.getElementById("timeline-section-personal");
      const node7El = document.getElementById("timeline-section-others");
      if (!node1El || !node7El) return;

      const node1Top = node1El.offsetTop + 24; // Center of Node 1
      const node7Top = node7El.offsetTop + 24; // Center of Node 7
      const span = Math.max(100, node7Top - node1Top);

      setNode1OffsetTop(node1Top);
      setTotalSpanPx(span);

      // Check if user has reached bottom of scroll container
      let isAtBottom = false;
      if (scrollParent instanceof HTMLElement) {
        isAtBottom =
          scrollParent.scrollTop + scrollParent.clientHeight >=
          scrollParent.scrollHeight - 60;
      } else {
        isAtBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 60;
      }

      // Focal sweep line in viewport (50% down from viewport top)
      const focalY = windowHeight * 0.5;
      const currentY = focalY - (containerRect.top + node1Top);

      let progress = span > 0 ? currentY / span : 0;
      if (isAtBottom) {
        progress = 1;
      } else {
        progress = Math.max(0, Math.min(1, progress));
      }

      const calculatedTargetHeight = progress * span;
      targetHeightRef.current = calculatedTargetHeight;

      // Detect reached steps
      const reached: number[] = [1];

      TIMELINE_STEPS.forEach((s) => {
        const el = document.getElementById(`timeline-section-${s.id}`);
        if (el) {
          const elTop = el.offsetTop + 24;
          const nodeDist = elTop - node1Top;
          if (calculatedTargetHeight >= nodeDist - 20 || isAtBottom) {
            reached.push(s.step);
          }
        }
      });

      setActiveSteps(reached);
    };

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      scrollParent.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Admin-assigned relation takes priority over user-chosen relation
  const emergencyRelationCode =
    details.assigned_emergency_relation || details.emergency_contact_relation;

  const emergencyMember = familyDetails.find(
    (f) => f.relation?.toUpperCase() === emergencyRelationCode?.toUpperCase(),
  );
  const emergencyContactNo = emergencyMember?.contactNo || "N/A";

  const getEmergencyRelationLabel = () => {
    if (!emergencyRelationCode) return "N/A";
    if (emergencyMember?.relationLabel) return emergencyMember.relationLabel;
    return (
      emergencyRelationCode.charAt(0).toUpperCase() +
      emergencyRelationCode.slice(1).toLowerCase()
    );
  };

  const formatEducationScore = (edu: (typeof educationDetails)[number]) => {
    if (
      (edu as unknown as { isPursuing?: boolean })?.isPursuing ||
      String(edu.year || "")
        .toLowerCase()
        .includes("pursuing")
    ) {
      return "N/A (Pursuing)";
    }
    if (!edu.percentage || String(edu.percentage).trim() === "") return "N/A";
    const val = String(edu.percentage).trim();
    if (val.includes("%") || val.toLowerCase().includes("cgpa")) return val;
    const gradingType = (edu as unknown as { gradingType?: string })
      ?.gradingType;
    if (gradingType === "Percentage") return `${val}%`;
    if (gradingType === "CGPA") return val;
    const num = parseFloat(val);
    if (!isNaN(num) && num > 10) return `${val}%`;
    return val;
  };

  if (!personalDetails) return null;

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* Top Header Section (When rendered in Admin or standalone) */}
      {!hideHeader && (
        <div className="p-6 md:p-8 rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 md:gap-6">
            {/* Avatar Section */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary border border-brand-primary/20 dark:border-brand-primary/30 shadow-inner shrink-0">
              <Typography
                variant="h3"
                weight="black"
                className="text-xl sm:text-2xl font-black uppercase text-brand-primary select-none"
              >
                {`${personalDetails?.firstName?.charAt(0) || ""}${personalDetails?.lastName?.charAt(0) || ""}` ||
                  "U"}
              </Typography>
            </div>

            {/* Candidate Details & Metadata */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <Typography
                  variant="h3"
                  weight="black"
                  className="capitalize text-xl md:text-2xl font-black tracking-tight text-foreground"
                >
                  {personalDetails?.firstName} {personalDetails?.lastName}
                </Typography>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-widest leading-none">
                  Candidate #{userId}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground">
                {personalDetails?.email && (
                  <span className="flex items-center gap-1.5 font-medium hover:text-foreground transition-colors">
                    <Mail size={15} className="text-brand-primary" />
                    {personalDetails.email}
                  </span>
                )}
                {personalDetails?.primaryMobile && (
                  <span className="flex items-center gap-1.5 font-medium hover:text-foreground transition-colors">
                    <Phone size={15} className="text-brand-primary" />
                    {personalDetails.primaryMobile}
                  </span>
                )}
                {department_name && (
                  <span className="flex items-center gap-1.5 font-medium hover:text-foreground transition-colors">
                    <Briefcase size={15} className="text-brand-primary" />
                    {department_name}
                  </span>
                )}
                {test_level_name && (
                  <span className="flex items-center gap-1.5 font-medium hover:text-foreground transition-colors">
                    <GraduationCap size={15} className="text-brand-primary" />
                    {test_level_name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0 flex items-center">
            <Link href={`/admin/management/users/update-details/${userId}`}>
              <Button
                variant="outline"
                color="primary"
                animate="scale"
                startIcon={<Pencil size={15} />}
                className="rounded-xl px-5 py-2.5 font-bold text-xs uppercase tracking-wider shadow-sm"
              >
                Update Profile
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Top Back Action Button */}
      <div className="flex items-center">
        <Link href={backUrl || "/user/dashboard"}>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-card hover:bg-muted/80 text-foreground transition-all text-xs font-bold shadow-sm cursor-pointer active:scale-95 hover:border-brand-primary/40"
          >
            <ArrowLeft size={15} className="text-brand-primary" />
            <span>Back to Dashboard</span>
          </button>
        </Link>
      </div>

      {/* ─── VERTICAL TIMELINE CONTAINER WITH ULTRA-SMOOTH RAF GLIDE ─── */}
      <div ref={timelineContainerRef} className="relative space-y-16 pt-2">
        {/* Background Grey Guide Line */}
        <div
          style={{
            top: `${node1OffsetTop}px`,
            height: totalSpanPx > 0 ? `${totalSpanPx}px` : "calc(100% - 48px)",
          }}
          className="absolute left-[22px] md:left-[26px] w-[4px] bg-slate-200 dark:bg-zinc-800 rounded-full"
        />

        {/* Dynamic Foreground Filled Line (Ultra-smooth 60/120fps hardware accelerated RAF) */}
        <div
          ref={fillLineRef}
          style={{
            top: `${node1OffsetTop}px`,
            height: "0px",
            willChange: "height",
          }}
          className="absolute left-[22px] md:left-[26px] w-[4px] bg-gradient-to-b from-brand-primary via-orange-500 to-amber-500 rounded-full shadow-[0_0_15px_rgba(249,99,49,0.85)] z-0"
        >
          {/* Glowing laser tip pulse bulb at bottom of active line */}
          <div className="absolute -bottom-1.5 -left-1 w-3.5 h-3.5 rounded-full bg-white ring-4 ring-brand-primary shadow-[0_0_14px_#f96331] animate-pulse" />
        </div>

        {/* ══════════════════════════════════════════
            STEP 1: PERSONAL DETAILS
        ══════════════════════════════════════════ */}
        <div
          id="timeline-section-personal"
          className="relative flex gap-6 md:gap-10 scroll-mt-6"
        >
          <TimelineNode
            step={1}
            isReached={activeSteps.includes(1)}
            icon={User}
          />

          <div className="flex-1 space-y-4 min-w-0">
            <TimelineHeader
              stepNumber={1}
              title="Personal Details"
              subtitle="Basic contact, demographic, and residential information"
              badge="Step 01"
            />

            <TimelineCard>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DetailItem
                    label="First Name"
                    value={personalDetails?.firstName}
                  />
                  <DetailItem
                    label="Last Name"
                    value={personalDetails?.lastName}
                  />
                  <DetailItem label="Gender" value={personalDetails?.gender} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 border-t border-border/50">
                  <DetailItem
                    label="Date of Birth"
                    value={
                      personalDetails?.dob
                        ? formatDateDDMMYYYY(personalDetails.dob)
                        : "N/A"
                    }
                    icon={<Calendar size={16} />}
                  />
                  <DetailItem
                    label="Primary Mobile"
                    value={personalDetails?.primaryMobile}
                    icon={<Phone size={16} />}
                  />
                  <DetailItem
                    label="Alternate Mobile"
                    value={personalDetails?.alternateMobile || "N/A"}
                    icon={<Phone size={16} />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 border-t border-border/50">
                  <DetailItem
                    label="Email Address"
                    value={personalDetails?.email}
                    icon={<Mail size={16} />}
                  />
                </div>

                {/* Residential Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-border/50">
                  <div className="p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-2.5">
                    <Typography
                      variant="body5"
                      weight="black"
                      className="text-muted-foreground uppercase tracking-wider text-xs flex items-center gap-2"
                    >
                      <MapPin size={15} className="text-brand-primary" />{" "}
                      Present Address
                    </Typography>
                    <p className="text-sm md:text-base font-semibold leading-relaxed text-foreground">
                      {[
                        personalDetails?.presentAddressLine1,
                        personalDetails?.presentAddressLine2,
                        personalDetails?.presentCity,
                        personalDetails?.presentDistrict,
                        personalDetails?.presentState,
                        personalDetails?.presentPincode,
                      ]
                        .filter((x) => x && String(x).trim() !== "")
                        .join(", ") || "N/A"}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-2.5">
                    <Typography
                      variant="body5"
                      weight="black"
                      className="text-muted-foreground uppercase tracking-wider text-xs flex items-center gap-2"
                    >
                      <MapPin size={15} className="text-brand-primary" />{" "}
                      Permanent Address
                    </Typography>
                    <p className="text-sm md:text-base font-semibold leading-relaxed text-foreground">
                      {(personalDetails?.sameAddress
                        ? [
                            personalDetails?.presentAddressLine1,
                            personalDetails?.presentAddressLine2,
                            personalDetails?.presentCity,
                            personalDetails?.presentDistrict,
                            personalDetails?.presentState,
                            personalDetails?.presentPincode,
                          ]
                        : [
                            personalDetails?.permanentAddressLine1,
                            personalDetails?.permanentAddressLine2,
                            personalDetails?.permanentCity,
                            personalDetails?.permanentDistrict,
                            personalDetails?.permanentState,
                            personalDetails?.permanentPincode,
                          ]
                      )
                        .filter((x) => x && String(x).trim() !== "")
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </TimelineCard>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            STEP 2: IDENTITY & DEMOGRAPHICS
        ══════════════════════════════════════════ */}
        <div
          id="timeline-section-identity"
          className="relative flex gap-6 md:gap-10 scroll-mt-6"
        >
          <TimelineNode
            step={2}
            isReached={activeSteps.includes(2)}
            icon={Fingerprint}
          />

          <div className="flex-1 space-y-4 min-w-0">
            <TimelineHeader
              stepNumber={2}
              title="Identity & Demographics"
              subtitle="Government identity credentials, category, and marital information"
              badge="Step 02"
            />

            <TimelineCard>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DetailItem
                    label="Blood Group"
                    value={additionalPersonalDetails?.bloodGroup}
                  />
                  <DetailItem
                    label="Religion"
                    value={additionalPersonalDetails?.religion}
                  />
                  <DetailItem
                    label="Category"
                    value={additionalPersonalDetails?.category}
                  />
                  <DetailItem
                    label="Marital Status"
                    value={additionalPersonalDetails?.maritalStatus}
                  />
                </div>

                {additionalPersonalDetails?.maritalStatus === "Married" &&
                  additionalPersonalDetails?.anniversaryDate && (
                    <div className="pt-5 border-t border-border/50">
                      <DetailItem
                        label="Anniversary Date"
                        value={
                          additionalPersonalDetails.anniversaryDate
                            ? formatDateDDMMYYYY(
                                additionalPersonalDetails.anniversaryDate,
                              )
                            : "N/A"
                        }
                        icon={<Calendar size={16} />}
                      />
                    </div>
                  )}

                {/* Identity Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-border/50">
                  <div className="space-y-4 p-5 rounded-2xl bg-muted/20 border border-border/60">
                    <DetailItem
                      label="Aadhaar Number"
                      value={additionalPersonalDetails?.aadhaarNo}
                      icon={
                        <CreditCard size={16} className="text-violet-500" />
                      }
                    />
                    <DetailItem
                      label="Name as per Aadhaar"
                      value={additionalPersonalDetails?.nameAsPerAadhaar}
                    />
                  </div>
                  <div className="space-y-4 p-5 rounded-2xl bg-muted/20 border border-border/60">
                    <DetailItem
                      label="PAN Card Number"
                      value={additionalPersonalDetails?.panNo}
                      icon={
                        <CreditCard size={16} className="text-violet-500" />
                      }
                    />
                    <DetailItem
                      label="Name as per PAN"
                      value={additionalPersonalDetails?.nameAsPerPan}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-border/50">
                  <DetailItem
                    label="Emergency Contact Relation"
                    value={getEmergencyRelationLabel()}
                  />
                  <DetailItem
                    label="Emergency Contact Number"
                    value={emergencyContactNo}
                    icon={<Phone size={16} />}
                  />
                </div>
              </div>
            </TimelineCard>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            STEP 3: FAMILY DETAILS
        ══════════════════════════════════════════ */}
        <div
          id="timeline-section-family"
          className="relative flex gap-6 md:gap-10 scroll-mt-6"
        >
          <TimelineNode
            step={3}
            isReached={activeSteps.includes(3)}
            icon={UsersIcon}
          />

          <div className="flex-1 space-y-4 min-w-0">
            <TimelineHeader
              stepNumber={3}
              title="Family Details"
              subtitle="Immediate family members and contact records"
              badge="Step 03"
            />

            <TimelineCard>
              {familyDetails.filter((f) => f.name).length === 0 ? (
                <EmptyState message="No family members recorded" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm md:text-base">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                        <th className="pb-3.5 font-bold w-[18%]">Relation</th>
                        <th className="pb-3.5 font-bold w-[26%]">Name</th>
                        <th className="pb-3.5 font-bold w-[22%]">Occupation</th>
                        <th className="pb-3.5 font-bold w-[16%]">Dependent</th>
                        <th className="pb-3.5 font-bold w-[18%]">Contact No</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {familyDetails
                        .filter((f) => f.name)
                        .map((fam, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-muted/20 transition-colors"
                          >
                            <td className="py-4 font-bold text-rose-500">
                              {fam.relationLabel ||
                                (fam.relation
                                  ? fam.relation.charAt(0).toUpperCase() +
                                    fam.relation.slice(1).toLowerCase()
                                  : "N/A")}
                            </td>
                            <td className="py-4 font-bold text-foreground">
                              {fam.name}
                            </td>
                            <td className="py-4 text-muted-foreground">
                              {fam.occupation || "N/A"}
                            </td>
                            <td className="py-4 text-muted-foreground">
                              {fam.dependent || "N/A"}
                            </td>
                            <td className="py-4 font-semibold text-muted-foreground">
                              {fam.contactNo || "N/A"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TimelineCard>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            STEP 4: SOURCE OF INFORMATION
        ══════════════════════════════════════════ */}
        <div
          id="timeline-section-source"
          className="relative flex gap-6 md:gap-10 scroll-mt-6"
        >
          <TimelineNode
            step={4}
            isReached={activeSteps.includes(4)}
            icon={Compass}
          />

          <div className="flex-1 space-y-4 min-w-0">
            <TimelineHeader
              stepNumber={4}
              title="Source of Information"
              subtitle="Recruitment channels, referrals, and prior organization history"
              badge="Step 04"
            />

            <TimelineCard>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DetailItem
                    label="Previous Interview"
                    value={
                      sourceOfInformation?.interviewedBefore === true ||
                      sourceOfInformation?.interviewedBefore === "yes" ||
                      sourceOfInformation?.interviewedBefore === "Yes"
                        ? "Yes, Previously Interviewed"
                        : "No"
                    }
                  />
                  <DetailItem
                    label="Past Employment at Company"
                    value={
                      sourceOfInformation?.workedBefore === true ||
                      sourceOfInformation?.workedBefore === "yes" ||
                      sourceOfInformation?.workedBefore === "Yes"
                        ? "Yes, Previously Employed"
                        : "No"
                    }
                  />
                </div>

                <div className="pt-5 border-t border-border/50 space-y-3.5">
                  <Typography
                    variant="body5"
                    weight="black"
                    className="text-muted-foreground uppercase tracking-wider text-xs"
                  >
                    Discovery & Application Channels
                  </Typography>

                  <div className="flex flex-wrap gap-2.5">
                    {sourceOfInformation?.source &&
                    Object.entries(sourceOfInformation.source).filter(
                      ([key, value]) =>
                        key !== "otherDetails" && Boolean(value),
                    ).length > 0 ? (
                      Object.entries(sourceOfInformation.source)
                        .filter(
                          ([key, value]) =>
                            key !== "otherDetails" && Boolean(value),
                        )
                        .map(([key]) => {
                          let label = key.replace(/([A-Z])/g, " $1");
                          if (
                            key.toLowerCase() === "others" ||
                            key.toLowerCase() === "other"
                          ) {
                            const otherText =
                              sourceOfInformation?.source?.otherDetails;
                            label = otherText
                              ? `Others: ${otherText}`
                              : "Others";
                          }
                          return (
                            <span
                              key={key}
                              className="px-4 py-2 bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 rounded-xl text-xs font-bold uppercase tracking-wider"
                            >
                              {label}
                            </span>
                          );
                        })
                    ) : (
                      <span className="text-base font-bold text-muted-foreground">
                        N/A
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </TimelineCard>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            STEP 5: EDUCATION DETAILS
        ══════════════════════════════════════════ */}
        <div
          id="timeline-section-education"
          className="relative flex gap-6 md:gap-10 scroll-mt-6"
        >
          <TimelineNode
            step={5}
            isReached={activeSteps.includes(5)}
            icon={GraduationCap}
          />

          <div className="flex-1 space-y-4 min-w-0">
            <TimelineHeader
              stepNumber={5}
              title="Education Details"
              subtitle="Academic qualifications, school / college credentials, and scores"
              badge="Step 05"
            />

            <TimelineCard>
              {educationDetails.filter((e) => e.school || e.type).length ===
              0 ? (
                <EmptyState message="No academic records submitted" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm md:text-base">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                        <th className="pb-3.5 font-bold">Qualification</th>
                        <th className="pb-3.5 font-bold">Education Details</th>
                        <th className="pb-3.5 font-bold">Institute / School</th>
                        <th className="pb-3.5 font-bold">Board / University</th>
                        <th className="pb-3.5 text-center font-bold">Medium</th>
                        <th className="pb-3.5 text-center font-bold">Year</th>
                        <th className="pb-3.5 text-right font-bold">
                          Percentage / CGPA
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {educationDetails
                        .filter((e) => e.school || e.type)
                        .map((edu, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-muted/20 transition-colors"
                          >
                            <td className="py-4 font-bold text-amber-500 uppercase whitespace-nowrap">
                              {edu.type || "N/A"}
                            </td>
                            <td className="py-4 font-semibold text-foreground">
                              {edu.details || "—"}
                            </td>
                            <td className="py-4 font-bold text-foreground">
                              {edu.school || "N/A"}
                            </td>
                            <td className="py-4 text-muted-foreground">
                              {edu.board || "N/A"}
                            </td>
                            <td className="py-4 text-center">
                              {edu.medium ? (
                                <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md text-xs font-bold uppercase">
                                  {edu.medium}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="py-4 text-center font-bold text-foreground whitespace-nowrap">
                              {edu.year || "N/A"}
                            </td>
                            <td className="py-4 text-right font-bold text-brand-primary whitespace-nowrap">
                              {formatEducationScore(edu)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TimelineCard>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            STEP 6: WORK EXPERIENCE
        ══════════════════════════════════════════ */}
        <div
          id="timeline-section-experience"
          className="relative flex gap-6 md:gap-10 scroll-mt-6"
        >
          <TimelineNode
            step={6}
            isReached={activeSteps.includes(6)}
            icon={Briefcase}
          />

          <div className="flex-1 space-y-4 min-w-0">
            <TimelineHeader
              stepNumber={6}
              title="Work Experience"
              subtitle="Prior employment history, career tenure, and salary breakdown"
              badge="Step 06"
            />

            <TimelineCard>
              {(() => {
                const effectiveWorkExp =
                  workExperienceDetails.length === 0
                    ? [
                        {
                          id: 1,
                          company: "Fresher",
                          designation: "No Prior Experience",
                          employmentType: "",
                          joinDate: "",
                          relieveDate: "",
                          salary: "",
                          reason: "",
                          isPresent: false,
                        },
                      ]
                    : workExperienceDetails;

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm md:text-base">
                      <thead>
                        <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                          <th className="pb-3.5 font-bold">Company & Role</th>
                          <th className="pb-3.5 font-bold">Type</th>
                          <th className="pb-3.5 text-center font-bold">
                            Joining Date
                          </th>
                          <th className="pb-3.5 text-center font-bold">
                            Relieving Date
                          </th>
                          <th className="pb-3.5 text-center font-bold">
                            Previous CTC
                          </th>
                          <th className="pb-3.5 text-right font-bold">
                            Reason for Leaving
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {effectiveWorkExp.map((work, idx) => {
                          const isFresher =
                            work.company?.toLowerCase() === "fresher";

                          return (
                            <tr
                              key={idx}
                              className="hover:bg-muted/20 transition-colors"
                            >
                              <td className="py-4">
                                <div className="font-bold text-foreground">
                                  {work.company || "Fresher"}
                                </div>
                                <div className="text-xs text-muted-foreground font-medium pt-0.5">
                                  {isFresher
                                    ? "No Prior Experience"
                                    : work.designation || "—"}
                                </div>
                              </td>
                              <td className="py-4 font-semibold text-blue-500 uppercase text-xs">
                                {!isFresher && work.employmentType ? (
                                  <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold">
                                    {work.employmentType.replace(/_/g, " ")}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="py-4 text-center font-semibold text-muted-foreground text-xs md:text-sm whitespace-nowrap">
                                {!isFresher && work.joinDate
                                  ? formatDateDDMMYYYY(work.joinDate)
                                  : "—"}
                              </td>
                              <td className="py-4 text-center font-semibold text-muted-foreground text-xs md:text-sm whitespace-nowrap">
                                {isFresher
                                  ? "—"
                                  : work.isPresent
                                    ? "Present"
                                    : work.relieveDate
                                      ? formatDateDDMMYYYY(work.relieveDate)
                                      : "Present"}
                              </td>
                              <td className="py-4 text-center font-bold text-brand-primary whitespace-nowrap">
                                {!isFresher && work.salary
                                  ? !isNaN(Number(work.salary))
                                    ? `₹${Number(work.salary).toLocaleString("en-IN")}`
                                    : work.salary.startsWith("₹")
                                      ? work.salary
                                      : `₹${work.salary}`
                                  : "—"}
                              </td>
                              <td className="py-4 text-right font-medium text-muted-foreground">
                                {!isFresher && work.reason ? work.reason : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </TimelineCard>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            STEP 7: OTHER DETAILS & PREFERENCES
        ══════════════════════════════════════════ */}
        <div
          id="timeline-section-others"
          className="relative flex gap-6 md:gap-10 scroll-mt-6"
        >
          <TimelineNode
            step={7}
            isReached={activeSteps.includes(7)}
            icon={FileText}
          />

          <div className="flex-1 space-y-4 min-w-0">
            <TimelineHeader
              stepNumber={7}
              title="Other Details & Preferences"
              subtitle="Service commitments, shift preferences, and salary expectations"
              badge="Step 07"
            />

            <TimelineCard>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DetailItem
                    label="Service Commitment"
                    value={otherDetails?.serviceCommitment}
                    icon={<Shield size={16} />}
                  />
                  <DetailItem
                    label="Security Deposit"
                    value={otherDetails?.securityDeposit}
                    icon={<Shield size={16} />}
                  />
                  <DetailItem
                    label="Shift Preference"
                    value={otherDetails?.shiftTime}
                    icon={<Calendar size={16} />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-border/50">
                  <DetailItem
                    label="Expected Joining Date"
                    value={
                      otherDetails?.expectedJoiningDate
                        ? formatDateDDMMYYYY(otherDetails.expectedJoiningDate)
                        : "N/A"
                    }
                    icon={<Calendar size={16} />}
                  />
                  <DetailItem
                    label="Expected Salary"
                    value={
                      otherDetails?.expectedSalary
                        ? `₹${otherDetails.expectedSalary}`
                        : "N/A"
                    }
                  />
                </div>
              </div>
            </TimelineCard>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HELPER SUB-COMPONENTS
───────────────────────────────────────────────────────────── */

function TimelineNode({
  step,
  isReached,
  icon: Icon,
}: {
  step: number;
  isReached: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="relative z-10 flex flex-col items-center shrink-0">
      <div
        className={cn(
          "w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl border-2 flex items-center justify-center transition-all duration-300",
          isReached
            ? "bg-gradient-to-br from-brand-primary to-orange-500 border-brand-primary text-white shadow-xl shadow-brand-primary/35 scale-105"
            : "bg-card border-slate-300 dark:border-zinc-700 text-muted-foreground shadow-sm",
        )}
      >
        <div className="flex flex-col items-center justify-center">
          <Icon
            size={18}
            className={cn(
              "hidden md:block transition-colors",
              isReached ? "text-white" : "text-muted-foreground",
            )}
          />
          <span
            className={cn(
              "text-xs md:text-[11px] font-black leading-none mt-0.5 transition-colors",
              isReached ? "text-white" : "text-muted-foreground",
            )}
          >
            {step}
          </span>
        </div>
      </div>
    </div>
  );
}

function TimelineHeader({
  title,
  subtitle,
  badge,
}: {
  stepNumber?: number;
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
      <div className="space-y-1">
        <Typography
          variant="h3"
          weight="black"
          className="text-xl md:text-2xl text-foreground tracking-tight flex items-center gap-2"
        >
          {title}
        </Typography>
        <Typography
          variant="body4"
          className="text-muted-foreground text-sm leading-relaxed"
        >
          {subtitle}
        </Typography>
      </div>
      <span className="w-fit px-3.5 py-1.5 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-xs font-black uppercase tracking-wider shrink-0">
        {badge}
      </span>
    </div>
  );
}

function TimelineCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 md:p-8 rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: unknown;
  icon?: React.ReactNode;
}) {
  const displayVal =
    value !== null && value !== undefined && String(value).trim() !== ""
      ? String(value)
      : "N/A";

  return (
    <div className="space-y-1.5">
      <Typography
        variant="body5"
        weight="black"
        className="text-muted-foreground uppercase tracking-wider text-xs"
      >
        {label}
      </Typography>
      <div className="flex items-center gap-2">
        {icon && <span className="text-brand-primary">{icon}</span>}
        <Typography
          variant="body3"
          weight="bold"
          className="text-foreground text-sm sm:text-base font-bold"
        >
          {displayVal}
        </Typography>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
      <div className="h-11 w-11 rounded-full border-2 border-dashed border-border mb-2 flex items-center justify-center text-muted-foreground text-sm font-bold">
        ?
      </div>
      <Typography
        variant="body4"
        className="italic text-muted-foreground text-xs md:text-sm"
      >
        {message}
      </Typography>
    </div>
  );
}
