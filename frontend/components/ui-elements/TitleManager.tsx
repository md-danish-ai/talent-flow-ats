"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface TitleManagerProps {
  baseTitle: string;
  baseRoutePrefix: string;
}

export function TitleManager({
  baseTitle,
  baseRoutePrefix,
}: TitleManagerProps) {
  const currentRoute = usePathname();

  useEffect(() => {
    if (!currentRoute) return;

    const prefixRegex = new RegExp(`^${baseRoutePrefix}\\/?`);
    const routeWithoutBase = currentRoute.replace(prefixRegex, "");

    if (!routeWithoutBase) {
      document.title = `Dashboard | ${baseTitle}`;
      return;
    }

    const segments = routeWithoutBase
      .split("/")
      .filter(
        (segment) =>
          segment.length > 0 && !segment.match(/^[0-9a-fA-F-]{10,}$|^\d+$/),
      );

    const formattedPageNames = segments.reverse().map((segment) => {
      const decodedText = decodeURIComponent(segment);
      return decodedText
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    });

    if (formattedPageNames.length > 0) {
      document.title = `${formattedPageNames.join(" | ")} | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [currentRoute, baseTitle, baseRoutePrefix]);

  return null;
}
