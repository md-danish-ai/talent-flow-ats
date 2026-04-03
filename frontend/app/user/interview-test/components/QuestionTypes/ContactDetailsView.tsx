"use client";
import { memo, useState } from "react";
import { Building2, Globe, MapPin, Phone } from "lucide-react";
import { Input } from "@components/ui-elements/Input";
import { Typography } from "@components/ui-elements/Typography";

interface ContactDetailsViewProps {
  questionText: string;
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

export const ContactDetailsView = memo(function ContactDetailsView({
  questionText,
  currentAnswer,
  onChangeAnswer,
}: ContactDetailsViewProps) {
  const [fieldAnswers, setFieldAnswers] = useState<Record<string, string>>(
    () => {
      try {
        return currentAnswer ? JSON.parse(currentAnswer) : {};
      } catch {
        return {};
      }
    },
  );

  const handleFieldChange = (key: string, value: string) => {
    const updated = { ...fieldAnswers, [key]: value };
    setFieldAnswers(updated);
    onChangeAnswer(JSON.stringify(updated));
  };

  const groups = [
    {
      title: "Company Info",
      icon: <Building2 className="w-4 h-4 text-brand-primary" />,
      fields: [
        {
          key: "companyName",
          label: "Company Name",
          placeholder: "e.g. Acme Corp",
        },
        {
          key: "websiteUrl",
          label: "Website URL",
          placeholder: "e.g. https://acme.com",
        },
      ],
    },
    {
      title: "Communication",
      icon: <Phone className="w-4 h-4 text-brand-primary" />,
      fields: [
        {
          key: "companyPhoneNumber",
          label: "Phone Number",
          placeholder: "e.g. +1 123-456-7890",
        },
        {
          key: "generalEmail",
          label: "General Email",
          placeholder: "e.g. contact@acme.com",
        },
        {
          key: "facebookPage",
          label: "Facebook Page",
          placeholder: "e.g. https://facebook.com/acme",
        },
      ],
    },
    {
      title: "Location",
      icon: <MapPin className="w-4 h-4 text-brand-primary" />,
      fields: [
        {
          key: "streetAddress",
          label: "Street Address",
          placeholder: "e.g. 123 Main St",
        },
        { key: "city", label: "City", placeholder: "e.g. Irving" },
        { key: "state", label: "State", placeholder: "e.g. TX" },
        { key: "zipCode", label: "Zip Code", placeholder: "e.g. 75039" },
      ],
    },
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Header Section */}
      <div className="flex items-center gap-4 group">
        <div className="bg-brand-primary/10 p-3 rounded-2xl border border-brand-primary/20 group-hover:bg-brand-primary/20 transition-all">
          <Globe className="w-5 h-5 text-brand-primary" />
        </div>
        <div className="space-y-0.5">
          <Typography
            variant="h3"
            className="text-foreground font-bold tracking-tight"
          >
            Company Analysis
          </Typography>
          <Typography
            variant="body5"
            className="text-muted-foreground uppercase tracking-[0.12em] font-black leading-none text-[10px]"
          >
            Institutional Data Entry
          </Typography>
        </div>
      </div>

      <div className="space-y-5">
        {/* Source Section */}
        <div className="rounded-2xl border border-border bg-muted/10 p-1 relative pt-5 shadow-sm">
          <div className="absolute top-0 left-6 -translate-y-1/2 flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <Typography
              variant="body5"
              weight="black"
              className="uppercase tracking-widest mr-1"
            >
              Target Source / URL
            </Typography>
          </div>
          <div className="p-5">
            <Typography
              variant="body2"
              weight="semibold"
              color="text-foreground"
              className="leading-relaxed tracking-tight break-all"
            >
              {questionText}
            </Typography>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
        {groups.map((group) => (
          <div
            key={group.title}
            className="flex flex-col rounded-xl border border-border bg-muted/10 overflow-hidden shadow-sm"
          >
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/20">
              {group.icon}
              <Typography variant="body3" className="font-bold text-foreground">
                {group.title}
              </Typography>
            </div>
            <div className="p-4 space-y-4 flex-1">
              {group.fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Typography
                    variant="body4"
                    className="font-semibold text-muted-foreground ml-0.5"
                  >
                    {f.label}
                  </Typography>
                  <Input
                    value={fieldAnswers[f.key] || ""}
                    onChange={(e) => handleFieldChange(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="bg-background border-border hover:border-brand-primary focus:border-brand-primary h-10"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
