"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { type AdminUserResultAnswer } from "@types";
import { STYLE_CONFIG } from "@lib/config/style";
import { humanizeString } from "@lib/utils";

interface StructuredResultViewProps {
  answer: AdminUserResultAnswer;
}

const LEAD_GEN_FIELD_MAP: Array<{
  key: string;
  label: string;
  aliases: string[];
}> = [
  {
    key: "contact_name",
    label: "Name of the Person",
    aliases: ["contact_name", "contactname", "name", "person_name"],
  },
  {
    key: "designation",
    label: "Title / Designation",
    aliases: ["designation", "title", "role"],
  },
  {
    key: "website",
    label: "Website Address (URL)",
    aliases: ["website", "website_url", "url", "websiteurl"],
  },
  {
    key: "email",
    label: "Person's Email Address",
    aliases: ["email", "email_address", "person_email"],
  },
];

const CONTACT_DETAILS_FIELD_MAP: Array<{
  key: string;
  label: string;
  aliases: string[];
}> = [
  {
    key: "companyName",
    label: "Company Name",
    aliases: ["companyname", "company_name", "company"],
  },
  {
    key: "companyPhoneNumber",
    label: "Phone Number",
    aliases: [
      "companyphonenumber",
      "company_phone_number",
      "phone",
      "phonenumber",
      "phone_number",
    ],
  },
  {
    key: "generalEmail",
    label: "General Email",
    aliases: ["generalemail", "general_email", "email"],
  },
  {
    key: "facebookPage",
    label: "Facebook Page",
    aliases: ["facebookpage", "facebook_page", "facebook"],
  },
  {
    key: "streetAddress",
    label: "Street Address",
    aliases: ["streetaddress", "street_address", "address"],
  },
  { key: "city", label: "City", aliases: ["city"] },
  { key: "state", label: "State", aliases: ["state"] },
  {
    key: "zipCode",
    label: "Zip Code",
    aliases: ["zipcode", "zip_code", "zip"],
  },
];

const formatStructuredEntries = (
  parsedObj: Record<string, unknown> | null,
  questionType?: string,
  subjectType?: string,
): Array<{ key: string; label: string; value: string }> => {
  if (!parsedObj || typeof parsedObj !== "object") return [];

  const isLeadGen =
    questionType === "LEAD_GENERATION" || subjectType === "LEAD_GENERATION";
  const isContactDetails =
    questionType === "CONTACT_DETAILS" ||
    subjectType === "COMPANY_CONTACT_DETAILS";

  if (isLeadGen) {
    const normalizedMap = new Map<string, string>();
    for (const [k, v] of Object.entries(parsedObj)) {
      if (v !== undefined && v !== null) {
        normalizedMap.set(k.toLowerCase().replace(/[^a-z0-9]/g, ""), String(v));
      }
    }

    return LEAD_GEN_FIELD_MAP.map((field) => {
      let matchedVal = "";
      for (const alias of field.aliases) {
        const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (normalizedMap.has(cleanAlias)) {
          matchedVal = normalizedMap.get(cleanAlias) || "";
          break;
        }
      }
      return {
        key: field.key,
        label: field.label,
        value: matchedVal || "N/A",
      };
    });
  }

  if (isContactDetails) {
    const normalizedMap = new Map<string, string>();
    for (const [k, v] of Object.entries(parsedObj)) {
      if (v !== undefined && v !== null) {
        normalizedMap.set(k.toLowerCase().replace(/[^a-z0-9]/g, ""), String(v));
      }
    }

    return CONTACT_DETAILS_FIELD_MAP.map((field) => {
      let matchedVal = "";
      for (const alias of field.aliases) {
        const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (normalizedMap.has(cleanAlias)) {
          matchedVal = normalizedMap.get(cleanAlias) || "";
          break;
        }
      }
      return {
        key: field.key,
        label: field.label,
        value: matchedVal || "N/A",
      };
    });
  }

  const IGNORED_KEYS = new Set([
    "marks",
    "id",
    "created_at",
    "updated_at",
    "is_active",
    "created_by",
    "subject_type",
    "question_type",
  ]);

  return Object.entries(parsedObj)
    .filter(([k]) => !IGNORED_KEYS.has(k.toLowerCase()))
    .map(([key, value]) => ({
      key,
      label: humanizeString(
        key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
      ),
      value: String(value ?? "N/A"),
    }));
};

export const StructuredResultView = ({ answer }: StructuredResultViewProps) => {
  const getParsedData = (
    dataString?: string | null,
    fallbackSource?: unknown,
  ): Record<string, unknown> | null => {
    if (
      dataString &&
      typeof dataString === "string" &&
      dataString.trim().startsWith("{")
    ) {
      try {
        const parsed = JSON.parse(dataString);
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          !Array.isArray(parsed)
        ) {
          return parsed as Record<string, unknown>;
        }
      } catch {
        // Fallback below
      }
    }

    if (fallbackSource) {
      try {
        const sourceObj = Array.isArray(fallbackSource)
          ? fallbackSource[0]
          : fallbackSource;

        if (typeof sourceObj === "string" && sourceObj.trim().startsWith("{")) {
          return JSON.parse(sourceObj) as Record<string, unknown>;
        }

        if (
          sourceObj &&
          typeof sourceObj === "object" &&
          !Array.isArray(sourceObj)
        ) {
          return sourceObj as Record<string, unknown>;
        }
      } catch {
        return null;
      }
    }

    return null;
  };

  const expectedParsed = getParsedData(
    answer.correct_answer || answer.passage,
    answer.options,
  );
  const candidateParsed = getParsedData(answer.user_answer);

  const expectedFormatted = formatStructuredEntries(
    expectedParsed,
    answer.question_type,
    answer.subject_type,
  );
  const candidateFormatted = formatStructuredEntries(
    candidateParsed,
    answer.question_type,
    answer.subject_type,
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Expected Structured Answer */}
      <div
        className={`${STYLE_CONFIG.innerCardRadius} border border-emerald-500/10 bg-emerald-500/[0.03] p-5 animate-in fade-in slide-in-from-top-4 duration-500`}
      >
        <Typography
          variant="body5"
          className="font-black text-emerald-600/60 mb-2 uppercase tracking-widest font-mono"
        >
          EXPECTED DATASTRUCTURE
        </Typography>

        {expectedFormatted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {expectedFormatted.map((item) => (
              <div
                key={item.key}
                className={`p-3 ${STYLE_CONFIG.innerCardRadius} bg-emerald-500/[0.03] border border-emerald-500/10 shadow-sm transition-all hover:bg-emerald-500/5`}
              >
                <Typography
                  variant="body5"
                  className="font-black text-[9px] uppercase tracking-wider text-emerald-600/50 mb-1 leading-none"
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  className="font-bold text-emerald-700/80 break-words leading-tight text-sm md:text-base"
                >
                  {item.value}
                </Typography>
              </div>
            ))}
          </div>
        ) : (
          <Typography
            as="div"
            variant="body2"
            className="font-mono leading-relaxed italic text-muted-foreground text-sm md:text-base"
          >
            {answer.correct_answer || answer.passage || "N/A"}
          </Typography>
        )}
      </div>

      {/* Candidate Structured Response */}
      <div
        className={`${STYLE_CONFIG.innerCardRadius} border border-black/[0.03] bg-black/[0.02] p-5 animate-in fade-in slide-in-from-bottom-4 duration-700`}
      >
        <Typography
          variant="body5"
          className="font-black text-muted-foreground/60 mb-2 uppercase tracking-widest"
        >
          CANDIDATE DATASTRUCTURE RESPONSE
        </Typography>

        {candidateFormatted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {candidateFormatted.map((item) => (
              <div
                key={item.key}
                className={`p-3 ${STYLE_CONFIG.innerCardRadius} bg-white/40 border border-black/[0.03] shadow-sm`}
              >
                <Typography
                  variant="body5"
                  className="font-black text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1 leading-none"
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  className="font-bold text-foreground break-words leading-tight text-sm md:text-base"
                >
                  {item.value}
                </Typography>
              </div>
            ))}
          </div>
        ) : (
          <Typography
            as="div"
            variant="body2"
            className="font-mono leading-relaxed text-foreground text-sm md:text-base"
          >
            {answer.user_answer || "No response recorded."}
          </Typography>
        )}
      </div>
    </div>
  );
};
