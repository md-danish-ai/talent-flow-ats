"use client";
import { useEffect, useState, memo } from "react";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
  Keyboard,
} from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";
import { Textarea } from "@components/ui-elements/Textarea";
import { Typography } from "@components/ui-elements/Typography";
import { Modal } from "@components/ui-elements/Modal";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import type { InterviewQuestion } from "../types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  // If already a full URL, we check if it's pointing to localhost/127.0.0.1
  // If it is, we replace it with the current BACKEND_BASE_URL because
  // 'localhost' won't work on other devices over the network.
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
    if (!isLocal) return url;
    
    // Extract path after the hostname (specifically for /images/...)
    const imagePath = url.split("/images/")[1];
    if (imagePath) {
      const base = BACKEND_BASE_URL.replace(/\/$/, "");
      return `${base}/images/${imagePath}`;
    }
    return url;
  }

  const base = BACKEND_BASE_URL.replace(/\/$/, "");
  if (url.includes("/images/")) {
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  }
  
  // Default fallback for relative filenames
  return `${base}/images/${url.startsWith("/") ? url.slice(1) : url}`;
}

const QuestionImage = memo(function QuestionImage({
  imageUrl,
  image_url,
}: {
  imageUrl?: string;
  image_url?: string;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const effectiveUrl = imageUrl || image_url;
  if (!effectiveUrl) return null;

  return (
    <div className="rounded-2xl border-2 border-border bg-muted/20 p-5 sm:p-6 overflow-hidden group/img-block shadow-lg shadow-brand-primary/5">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1 rounded bg-brand-primary/10 text-brand-primary">
          <Globe size={14} className="animate-pulse" />
        </div>
        <Typography
          variant="body5"
          className="text-muted-foreground uppercase tracking-widest font-black text-[10px]"
        >
          Question Reference Image
        </Typography>
      </div>
      <div
        className="relative group/canvas overflow-hidden rounded-xl border border-border bg-white p-2 flex justify-center cursor-zoom-in group-hover/img-block:border-brand-primary/30 transition-colors"
        onClick={() => setIsPreviewOpen(true)}
      >
        {hasImageError ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 dark:bg-red-950/20 rounded-xl text-red-500 w-full min-h-[200px]">
            <Globe size={32} className="mb-3 opacity-20" />
            <Typography variant="body4" className="font-bold">
              Image Unavailable
            </Typography>
            <Typography variant="body5" className="mt-1 opacity-70 italic">
              {resolveImageUrl(effectiveUrl)}
            </Typography>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 z-20 bg-brand-primary/0 group-hover/canvas:bg-brand-primary/5 transition-colors flex items-center justify-center opacity-0 group-hover/canvas:opacity-100">
              <div className="bg-white/90 p-2 rounded-full shadow-lg transform scale-90 group-hover/canvas:scale-100 transition-all">
                <ZoomIn className="w-5 h-5 text-brand-primary" />
              </div>
            </div>
            <Image
              src={resolveImageUrl(effectiveUrl)}
              alt="Question context"
              width={800}
              height={450}
              unoptimized
              loading="eager"
              className="w-full max-w-[800px] h-auto rounded-lg object-contain transition-all duration-500 group-hover/canvas:scale-[1.01]"
              onError={() => setHasImageError(true)}
            />
          </>
        )}
      </div>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Question Reference Image"
        className="max-w-6xl"
        closeOnOutsideClick
      >
        <div className="relative w-full overflow-hidden rounded-lg bg-white p-4">
          <Image
            src={resolveImageUrl(effectiveUrl)}
            alt="Fullscreen context"
            width={1200}
            height={800}
            unoptimized
            className="w-full h-auto max-h-[75vh] object-contain"
          />
        </div>
      </Modal>
    </div>
  );
});

interface QuestionInputProps {
  question: InterviewQuestion;
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

function QuestionInputComponent({
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
      <div className="space-y-6 pt-2">
        {/* Title Bar */}
        <div className="flex items-center gap-4 group">
          <div className="bg-brand-primary/10 p-3 rounded-2xl border border-brand-primary/20 group-hover:bg-brand-primary/20 transition-all">
            <Keyboard className="w-5 h-5 text-brand-primary" />
          </div>
          <div className="space-y-0.5">
            <Typography
              variant="body5"
              className="text-muted-foreground uppercase tracking-[0.15em] font-black leading-none"
            >
              Typing Exercise
            </Typography>
            <Typography variant="h3" className="text-foreground font-bold tracking-tight">
              {question.questionText}
            </Typography>
          </div>
        </div>

        {/* Typing Source Card */}
        <div className="relative group/source">
          <div className="absolute -inset-1.5 bg-gradient-to-br from-brand-primary/15 via-transparent to-brand-primary/5 rounded-[1.5rem] blur-sm opacity-70 group-hover/source:opacity-100 transition-opacity" />
          <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-md p-7 sm:p-8 select-none overflow-hidden shadow-2xl shadow-brand-primary/5">
            <div className="absolute -top-10 -right-4 p-3 opacity-5 group-hover/source:opacity-10 transition-opacity pointer-events-none">
              <Typography className="font-serif text-[180px] leading-none">&quot;</Typography>
            </div>
            <Typography
              variant="body2"
              className="text-foreground/90 leading-[2] font-mono text-lg whitespace-pre-wrap relative z-10 antialiased tracking-wide"
            >
              {question.passage}
            </Typography>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Typography
                variant="body4"
                className="font-bold text-brand-primary uppercase tracking-widest text-[11px]"
              >
                Start Typing Below
              </Typography>
              <div className="h-1 w-1 rounded-full bg-brand-primary animate-ping" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-[1px] bg-border" />
              <Typography variant="body5" className="font-mono text-[11px]">
                {currentAnswer.length} characters typed
              </Typography>
            </div>
          </div>
          <Textarea
            rows={10}
            placeholder="Focus and start typing here..."
            value={currentAnswer}
            onChange={(event) => onChangeAnswer(event.target.value)}
            className="rounded-2xl font-mono text-lg leading-relaxed bg-muted/10 border-2 border-border focus:border-brand-primary focus:bg-background focus:ring-[8px] focus:ring-brand-primary/10 transition-all p-6 shadow-inner"
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

      {question.passage && question.type !== "TYPING_TEST" && (
        <div className="rounded-lg border border-border bg-muted/20 p-3 sm:p-4 max-h-56 sm:max-h-60 overflow-y-auto">
          <Typography variant="body4" className="text-foreground mb-1">
            Passage
          </Typography>
          <Typography variant="body3" className="leading-relaxed">
            {question.passage}
          </Typography>
        </div>
      )}

      <QuestionImage 
        key={question.id}
        imageUrl={question.imageUrl} 
        image_url={question.image_url} 
      />

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

export const QuestionInput = memo(QuestionInputComponent);
