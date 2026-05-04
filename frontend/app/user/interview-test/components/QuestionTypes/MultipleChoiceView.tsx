"use client";
import { memo, useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { Radio } from "@components/ui-elements/Radio";
import { Typography } from "@components/ui-elements/Typography";
import { Modal } from "@components/ui-elements/Modal";
import { getCanonicalImageUrl } from "@lib/utils/image";
import { cn } from "@lib/utils";

interface MultipleChoiceViewProps {
  questionId: number;
  options: (
    | string
    | { option_text: string; image_url?: string; imageUrl?: string }
  )[];
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

export const MultipleChoiceView = memo(function MultipleChoiceView({
  questionId,
  options,
  currentAnswer,
  onChangeAnswer,
}: MultipleChoiceViewProps) {
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  interface OptionObject {
    option_text?: string;
    optionText?: string;
    image_url?: string;
    imageUrl?: string;
  }

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 px-2 mb-1">
        <Typography
          variant="body4"
          className="font-bold text-brand-primary uppercase tracking-widest text-[11px]"
        >
          Select Your Answer
        </Typography>
        <div className="h-1 w-1 rounded-full bg-brand-primary animate-ping" />
      </div>

      <div
        className={cn(
          "grid gap-4",
          options.some((o) => {
            if (typeof o !== "object" || o === null) return false;
            const opt = o as OptionObject;
            return !!(opt.image_url || opt.imageUrl);
          })
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1",
        )}
      >
        {(options || []).map((option, index) => {
          const optionKey = String.fromCharCode(65 + index);
          const savedValue = optionKey;

          // Normalize option content with support for both snake_case and camelCase
          const isObject = typeof option === "object" && option !== null;


          const optObj = isObject ? (option as OptionObject) : null;
          const optionText = optObj
            ? optObj.option_text || optObj.optionText || ""
            : (option as string);
          const optionImageUrl = optObj
            ? optObj.image_url || optObj.imageUrl || null
            : null;

          const isChecked = currentAnswer === savedValue;
          const hasImage = !!optionImageUrl;

          return (
            <label
              key={`${questionId}-${optionKey}`}
              className={cn(
                "group relative border transition-all cursor-pointer flex",
                hasImage 
                  ? "flex-col gap-3 rounded-2xl p-4 items-center text-center" 
                  : "flex-row items-center gap-4 rounded-xl p-3 min-h-[52px]",
                isChecked
                  ? "border-brand-primary bg-brand-primary/5 shadow-[0_8px_20px_rgba(249,99,49,0.08)]"
                  : "border-border bg-card hover:border-brand-primary/30 hover:bg-brand-primary/[0.02]"
              )}
            >
              <div className={cn("flex items-center gap-3", hasImage ? "w-full justify-start" : "shrink-0")}>
                <Radio
                  checked={isChecked}
                  onChange={() => onChangeAnswer(savedValue)}
                  name={`question-${questionId}`}
                />
                {/* Only show 'Option A' label explicitly if it's an image question or if there's no text */}
                {(hasImage || !optionText) && (
                  <Typography
                    variant="body2"
                    className={cn(
                      "transition-colors font-bold",
                      isChecked ? "text-brand-primary" : "text-foreground/70"
                    )}
                  >
                    Option {optionKey}
                  </Typography>
                )}
              </div>

              {optionImageUrl && (
                <div 
                  className="relative w-full max-w-[240px] aspect-video rounded-xl overflow-hidden border border-border bg-muted/20 group/opt-img cursor-zoom-in"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPreviewImage({
                      url: optionImageUrl,
                      title: `Option ${optionKey}`
                    });
                  }}
                >
                  <div className="absolute inset-0 z-10 bg-black/0 group-hover/opt-img:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover/opt-img:opacity-100">
                    <div className="bg-white/90 p-1.5 rounded-full shadow-lg transform scale-90 group-hover/opt-img:scale-100 transition-all">
                      <ZoomIn className="w-4 h-4 text-brand-primary" />
                    </div>
                  </div>
                  <Image
                    src={getCanonicalImageUrl(optionImageUrl) as string}
                    alt={`Option ${optionKey}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              {optionText && (
                <Typography
                  variant="body2"
                  className={cn(
                    "transition-colors break-words text-left",
                    hasImage ? "w-full" : "flex-1",
                    isChecked
                      ? "text-brand-primary font-medium"
                      : "text-foreground group-hover:text-brand-primary/80"
                  )}
                >
                  {optionText}
                </Typography>
              )}
            </label>
          );
        })}
      </div>

      <Modal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.title || "Option Image"}
        className="max-w-4xl"
        closeOnOutsideClick
      >
        {previewImage && (
          <div className="relative w-full overflow-hidden rounded-lg bg-white p-2">
            <Image
              src={getCanonicalImageUrl(previewImage.url)}
              alt="Option preview"
              width={1200}
              height={800}
              unoptimized
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>
        )}
      </Modal>
    </div>
  );
});
