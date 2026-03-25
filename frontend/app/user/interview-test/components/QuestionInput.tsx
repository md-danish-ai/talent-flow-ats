import { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";
import { Textarea } from "@components/ui-elements/Textarea";
import { Typography } from "@components/ui-elements/Typography";
import type { InterviewQuestion } from "../types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

/** Converts a relative `/images/...` path from the backend into a full URL. */
function resolveImageUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${BACKEND_BASE_URL}${url}`;
}

interface QuestionInputProps {
  question: InterviewQuestion;
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

export function QuestionInput({
  question,
  currentAnswer,
  onChangeAnswer,
}: QuestionInputProps) {
  const isChoiceType =
    question.type === "MCQ" ||
    question.type === "IMAGE_MCQ" ||
    question.type === "PASSAGE_MCQ";

  const isFormType =
    question.type === "CONTACT_DETAILS" || question.type === "LEAD_GENERATION";

  // State for multi-field answers (JSON based)
  const [fieldAnswers, setFieldAnswers] = useState<Record<string, string>>(
    () => {
      try {
        return currentAnswer && isFormType ? JSON.parse(currentAnswer) : {};
      } catch {
        return {};
      }
    },
  );

  // Reset local form state when question changes
  useEffect(() => {
    if (isFormType) {
      try {
        setFieldAnswers(currentAnswer ? JSON.parse(currentAnswer) : {});
      } catch {
        setFieldAnswers({});
      }
    } else {
      setFieldAnswers({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, question.type]);

  const handleFieldChange = (key: string, value: string) => {
    const updated = { ...fieldAnswers, [key]: value };
    setFieldAnswers(updated);
    onChangeAnswer(JSON.stringify(updated));
  };

  const renderContactFields = () => {
    const groups = [
      {
        title: "Company Info",
        icon: <Building2 className="w-4 h-4 text-brand-primary" />,
        fields: [
          { key: "companyName", label: "Company Name", placeholder: "e.g. Acme Corp" },
          { key: "websiteUrl", label: "Website URL", placeholder: "e.g. https://acme.com" },
        ],
      },
      {
        title: "Communication",
        icon: <Phone className="w-4 h-4 text-brand-primary" />,
        fields: [
          { key: "companyPhoneNumber", label: "Phone Number", placeholder: "e.g. +1 123-456-7890" },
          { key: "generalEmail", label: "General Email", placeholder: "e.g. contact@acme.com" },
          { key: "facebookPage", label: "Facebook Page", placeholder: "e.g. https://facebook.com/acme" },
        ],
      },
      {
        title: "Location",
        icon: <MapPin className="w-4 h-4 text-brand-primary" />,
        fields: [
          { key: "streetAddress", label: "Street Address", placeholder: "e.g. 123 Main St" },
          { key: "city", label: "City", placeholder: "e.g. Irving" },
          { key: "state", label: "State", placeholder: "e.g. TX" },
          { key: "zipCode", label: "Zip Code", placeholder: "e.g. 75039" },
        ],
      },
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col rounded-xl border border-border bg-muted/10 overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/20">
              {group.icon}
              <Typography variant="body3" className="font-bold text-foreground">
                {group.title}
              </Typography>
            </div>
            <div className="p-4 space-y-4 flex-1">
              {group.fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Typography variant="body4" className="font-semibold text-muted-foreground ml-0.5">
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
    );
  };

  const renderLeadGenFields = () => {
    const groups = [
      {
        title: "Candidate Info",
        icon: <User className="w-4 h-4 text-brand-primary" />,
        fields: [
          { key: "contact_name", label: "Full Name", placeholder: "e.g. John Doe" },
          { key: "designation", label: "Current Role", placeholder: "e.g. Manager" },
        ],
      },
      {
        title: "Professional Details",
        icon: <Building2 className="w-4 h-4 text-brand-primary" />,
        fields: [
          { key: "company_name", label: "Company", placeholder: "e.g. Acme Corp" },
          { key: "website", label: "Website", placeholder: "e.g. https://acme.com" },
          { key: "linkedin_url", label: "LinkedIn URL", placeholder: "e.g. linkedin.com/johndoe" },
        ],
      },
      {
        title: "Contact Details",
        icon: <Mail className="w-4 h-4 text-brand-primary" />,
        fields: [
          { key: "email", label: "Work Email", placeholder: "e.g. john@acme.com" },
          { key: "phone", label: "Phone", placeholder: "e.g. +1 123-456-7890" },
          { key: "address", label: "Location", placeholder: "e.g. Bangalore, India" },
        ],
      },
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col rounded-xl border border-border bg-muted/10 overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/20">
              {group.icon}
              <Typography variant="body3" className="font-bold text-foreground">
                {group.title}
              </Typography>
            </div>
            <div className="p-4 space-y-4 flex-1">
              {group.fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Typography variant="body4" className="font-semibold text-muted-foreground ml-0.5">
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
    );
  };

  const renderTypingTest = () => {
    return (
      <div className="space-y-4 pt-2">
        <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-5 select-none">
          <Typography
            variant="body3"
            className="text-muted-foreground leading-loose italic"
          >
            &quot;{question.questionText}&quot;
          </Typography>
        </div>
        <div className="space-y-2">
          <Typography
            variant="body4"
            className="font-semibold text-muted-foreground px-1"
          >
            Type the above text here:
          </Typography>
          <Textarea
            rows={10}
            placeholder="Start typing here..."
            value={currentAnswer}
            onChange={(event) => onChangeAnswer(event.target.value)}
            className="rounded-xl font-mono text-base leading-relaxed tracking-wide bg-card border-2 border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all p-4"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Typography variant="h3" className="text-foreground">
          {question.typeName ||
            (question.type === "SUBJECTIVE"
              ? "Subjective Question"
              : "Multiple Choice Question")}
        </Typography>
        {question.subjectName && (
          <Badge variant="outline" color="secondary" className="w-fit">
            {question.subjectName}
          </Badge>
        )}
      </div>

      {question.description && (
        <Typography variant="body3" className="text-muted-foreground">
          {question.description}
        </Typography>
      )}

      {question.passage && (
        <div className="rounded-lg border border-border bg-muted/20 p-3 sm:p-4 max-h-56 sm:max-h-60 overflow-y-auto">
          <Typography variant="body4" className="text-foreground mb-1">
            Passage
          </Typography>
          <Typography variant="body3" className="leading-relaxed">
            {question.passage}
          </Typography>
        </div>
      )}

      {question.imageUrl && (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <Typography variant="body5" className="mb-2">
            Reference Image
          </Typography>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImageUrl(question.imageUrl)}
            alt="Question reference"
            className="w-full max-w-[320px] h-auto rounded-lg border border-border object-contain bg-white"
          />
        </div>
      )}

      {isFormType ? (
        <div className="rounded-xl border border-border bg-brand-primary/5 p-4 flex items-center gap-4">
          <div className="bg-brand-primary/10 p-2.5 rounded-lg border border-brand-primary/20">
            <Globe className="w-5 h-5 text-brand-primary" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <Typography variant="body5" className="text-muted-foreground uppercase tracking-wider font-bold">
              Target Source / URL
            </Typography>
            <Typography variant="body2" className="text-foreground font-bold break-all">
              {question.questionText}
            </Typography>
          </div>
        </div>
      ) : (
        question.type !== "TYPING_TEST" && (
          <Typography variant="body2" className="text-foreground font-semibold">
            {question.questionText}
          </Typography>
        )
      )}

      {question.type === "CONTACT_DETAILS" ? (
        renderContactFields()
      ) : question.type === "LEAD_GENERATION" ? (
        renderLeadGenFields()
      ) : question.type === "TYPING_TEST" ? (
        renderTypingTest()
      ) : isChoiceType ? (
        <div className="space-y-3">
          {(question.options || []).map((option, index) => {
            const optionKey = String.fromCharCode(65 + index);
            const savedValue = optionKey;
            const displayValue = `${optionKey}. ${option}`;
            const isChecked = currentAnswer === savedValue;

            return (
              <label
                key={`${question.id}-${optionKey}`}
                className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                  isChecked
                    ? "border-brand-primary bg-brand-primary/10 shadow-[0_6px_20px_rgba(249,99,49,0.14)]"
                    : "border-border bg-card hover:border-brand-primary/40 hover:bg-brand-primary/5"
                }`}
              >
                <Radio
                  checked={isChecked}
                  onChange={() => onChangeAnswer(savedValue)}
                  name={`question-${question.id}`}
                />
                <Typography
                  variant="body3"
                  className={`transition-colors break-words ${
                    isChecked
                      ? "text-brand-primary font-semibold"
                      : "text-foreground group-hover:text-brand-primary"
                  }`}
                >
                  {displayValue}
                </Typography>
              </label>
            );
          })}
        </div>
      ) : (
        <Textarea
          rows={8}
          placeholder="Write your answer here..."
          value={currentAnswer}
          onChange={(event) => onChangeAnswer(event.target.value)}
          className="rounded-xl"
        />
      )}
    </div>
  );
}
