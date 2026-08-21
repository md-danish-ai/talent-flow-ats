export const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Safely parses any date string, number, or Date originating from UTC backend
 * into a JavaScript Date object. Handles missing 'Z', SQL timestamps with spaces,
 * and standard ISO timestamps.
 */
export const parseUTCDate = (
  date: Date | string | number | null | undefined,
): Date | null => {
  if (date === null || date === undefined || date === "") return null;
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }
  if (typeof date === "number") {
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  }

  const trimmed = String(date).trim();
  if (
    !trimmed ||
    trimmed.toLowerCase() === "n/a" ||
    trimmed.toLowerCase() === "null" ||
    trimmed.toLowerCase() === "undefined"
  ) {
    return null;
  }

  // If already has timezone indicator (Z or +HH:MM / -HH:MM at end)
  if (/Z|[+-]\d{2}(?::?\d{2})?$/i.test(trimmed)) {
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  }

  // Pure YYYY-MM-DD date without time (e.g. "2024-08-19")
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const d = new Date(`${trimmed}T00:00:00Z`);
    return isNaN(d.getTime()) ? null : d;
  }

  // Replace space with T and append Z (e.g. "2024-08-19 14:30:45.123456" -> "2024-08-19T14:30:45.123456Z")
  const isoFormatted = trimmed.replace(" ", "T");
  const d = new Date(`${isoFormatted}Z`);
  if (!isNaN(d.getTime())) {
    return d;
  }

  const fallback = new Date(trimmed);
  return isNaN(fallback.getTime()) ? null : fallback;
};

/** Alias for parseUTCDate to explicitly represent UTC-to-IST parsing */
export const parseUtcToIst = parseUTCDate;

/**
 * Formats a UTC date into IST date string (e.g. "20 Aug 2026").
 */
export const formatDate = (
  date: Date | string | number | null | undefined,
  fallback = "—",
): string => {
  const d = parseUTCDate(date);
  if (!d) return fallback;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: IST_TIMEZONE,
  });
};

/**
 * Formats a UTC date into IST time string (e.g. "01:37 PM").
 */
export const formatTime = (
  date: Date | string | number | null | undefined,
  fallback = "—",
): string => {
  const d = parseUTCDate(date);
  if (!d) return fallback;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: IST_TIMEZONE,
  });
};

/**
 * Formats a UTC date into IST long date (e.g. "20 Aug 2026").
 */
export const formatLongDate = (
  date: Date | string | number | null | undefined,
  fallback = "—",
): string => {
  const d = parseUTCDate(date);
  if (!d) return fallback;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: IST_TIMEZONE,
  });
};

/**
 * Formats a UTC date into IST long time (e.g. "1:37 PM").
 */
export const formatLongTime = (
  date: Date | string | number | null | undefined,
  fallback = "—",
): string => {
  const d = parseUTCDate(date);
  if (!d) return fallback;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: IST_TIMEZONE,
  });
};

/**
 * Formats a UTC date into full IST date and time (e.g. "20 Aug 2026, 01:37 PM").
 */
export const formatDateTime = (
  date: Date | string | number | null | undefined,
  fallback = "—",
): string => {
  const d = parseUTCDate(date);
  if (!d) return fallback;
  const dateStr = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: IST_TIMEZONE,
  });
  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: IST_TIMEZONE,
  });
  return `${dateStr}, ${timeStr}`;
};

/**
 * Formats a UTC date into IST short date (e.g. "20/08/2026").
 */
export const formatDateShort = (
  date: Date | string | number | null | undefined,
  fallback = "—",
): string => {
  const d = parseUTCDate(date);
  if (!d) return fallback;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: IST_TIMEZONE,
  });
};

/**
 * Formats a UTC date into IST short date and time (e.g. "20/08/2026, 01:37 PM").
 */
export const formatDateTimeShort = (
  date: Date | string | number | null | undefined,
  fallback = "—",
): string => {
  const d = parseUTCDate(date);
  if (!d) return fallback;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: IST_TIMEZONE,
  });
};

/**
 * Formats a UTC date into Indian DD/MM/YYYY format.
 */
export const formatDateIN = (
  date: Date | string | number | null | undefined,
  fallback = "—",
): string => {
  const d = parseUTCDate(date);
  if (!d) return fallback;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: IST_TIMEZONE,
  });
};

/**
 * Formats seconds into MM:SS format (e.g. "05:30").
 */
export const formatSecondsToTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

/**
 * Returns today's ISO date string in YYYY-MM-DD for IST (Asia/Kolkata).
 */
export const getTodayISODate = (): string => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
};

/**
 * Returns yesterday's ISO date string in YYYY-MM-DD for IST (Asia/Kolkata).
 */
export const getYesterdayISODate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(d);
};

/**
 * Safe DD-MM-YYYY date formatter.
 */
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

      // 1. Match pure YYYY-MM-DD pattern (e.g. "2024-08-19")
      const pureIsoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
      if (pureIsoMatch) {
        const [, y, m, d] = pureIsoMatch;
        return `${d}-${m}-${y}`;
      }

      // 2. Match DD-MM-YYYY or DD/MM/YYYY pattern
      const dmyMatch = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(trimmed);
      if (dmyMatch) {
        const [, d, m, y] = dmyMatch;
        return `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
      }
    }

    const d = parseUTCDate(date);
    if (!d || isNaN(d.getTime())) return fallback;

    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: IST_TIMEZONE,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formatter.format(d).replace(/\//g, "-");
  } catch {
    return fallback;
  }
};
