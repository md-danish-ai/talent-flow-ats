"use client";

import React, { useEffect } from "react";
import { Button } from "@components/ui-elements/Button";
import { X } from "lucide-react";

interface ImageLightboxProps {
  url: string | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ url, onClose }) => {
  useEffect(() => {
    if (!url) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [url, onClose]);

  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-[95%] max-h-[95%]" onClick={(e) => e.stopPropagation()}>
        <div className="rounded-md shadow-lg bg-white p-2">
          <img
            src={url ?? undefined}
            alt="preview"
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-md"
          />
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
