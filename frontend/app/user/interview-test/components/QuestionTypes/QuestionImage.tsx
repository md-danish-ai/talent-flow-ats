"use client";
import { memo, useState } from "react";
import { Globe, ZoomIn } from "lucide-react";
import Image from "next/image";
import { Typography } from "@components/ui-elements/Typography";
import { Modal } from "@components/ui-elements/Modal";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
    if (!isLocal) return url;

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

  return `${base}/images/${url.startsWith("/") ? url.slice(1) : url}`;
}

interface QuestionImageProps {
  imageUrl?: string;
  image_url?: string;
}

export const QuestionImage = memo(function QuestionImage({
  imageUrl,
  image_url,
}: QuestionImageProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const effectiveUrl = imageUrl || image_url;
  if (!effectiveUrl) return null;

  return (
    <div className="rounded-2xl border border-border bg-muted/10 p-1 relative pt-5 shadow-sm group/img-block">
      <div className="absolute top-0 left-6 -translate-y-1/2 flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 animate-pulse" />
        <Typography
          variant="body5"
          weight="black"
          className="text-muted-foreground uppercase tracking-widest mr-1"
        >
          Question Reference Image
        </Typography>
      </div>

      <div className="p-3 sm:p-4 overflow-hidden">
        <div
          className="relative group/canvas overflow-hidden rounded-xl border border-border bg-white p-1 flex justify-center cursor-zoom-in group-hover/img-block:border-brand-primary/30 transition-colors"
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
    </div>
  );
});
