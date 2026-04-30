"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@components/ui-elements/Button";
import { X } from "lucide-react";
import { getCanonicalImageUrl } from "@lib/utils/image";

interface ImageLightboxProps {
  url: string | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  url,
  onClose,
}) => {
  useEffect(() => {
    if (!url) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [url, onClose]);

  if (!url) return null;

  const src = getCanonicalImageUrl(url) || undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-[95%] max-h-[95%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-md shadow-lg bg-white p-2">
          {src ? (
            <div className="relative w-[90vw] h-[80vh]">
              <Image
                src={src}
                alt="preview"
                className="object-contain rounded-md"
                fill
                sizes="(max-width: 1024px) 90vw, 1200px"
                priority
                // allow rendering even if the domain isn't configured yet
                unoptimized={true}
              />
            </div>
          ) : null}
        </div>
        <Button
          size="rounded-icon"
          variant="ghost"
          onClick={onClose}
          className="absolute top-2 right-2"
          aria-label="Close image"
        >
          <X size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ImageLightbox;
