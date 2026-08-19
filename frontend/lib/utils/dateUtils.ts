export const formatDate = (date: Date | string | number): string => {
  const d = typeof date === "string" ? parseUTCDate(date) : new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (date: Date | string | number): string => {
  const d = typeof date === "string" ? parseUTCDate(date) : new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatSecondsToTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const formatLongDate = (date: Date | string | number): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatLongTime = (date: Date | string | number): string => {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getTodayISODate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const formatDateShort = (date: Date | string | number): string => {
  return new Date(date).toLocaleDateString();
};

export const formatDateTimeShort = (date: Date | string | number): string => {
  return new Date(date).toLocaleString();
};

export const parseUTCDate = (dateStr: string): Date => {
  const tzDate = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`;
  return new Date(tzDate);
};

export const formatDateIN = (date: Date | string | number): string => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getYesterdayISODate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

export const formatDateDDMMYYYY = (
  date: Date | string | number | null | undefined,
  fallback = "—",
): string => {
  try {
    if (date === null || date === undefined) return fallback;

    if (typeof date === "string") {
      const trimmed = date.trim();
      if (
        !trimmed ||
        trimmed.toLowerCase() === "n/a" ||
        trimmed.toLowerCase() === "null" ||
        trimmed.toLowerCase() === "undefined"
      ) {
        return fallback;
      }

      // 1. Match YYYY-MM-DD pattern (e.g. 2024-08-19 or 2024-08-19T14:30:00.000Z)
      const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
      if (isoMatch) {
        const [, y, m, d] = isoMatch;
        return `${d}-${m}-${y}`;
      }

      // 2. Match DD-MM-YYYY or DD/MM/YYYY pattern
      const dmyMatch = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(trimmed);
      if (dmyMatch) {
        const [, d, m, y] = dmyMatch;
        return `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
      }
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) return fallback;

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return fallback;
  }
};
