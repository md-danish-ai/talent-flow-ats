import { describe, it, expect } from "vitest";
import {
  formatDateDDMMYYYY,
  parseUTCDate,
  parseUtcToIst,
  formatDate,
  formatTime,
  formatLongDate,
  formatLongTime,
  formatDateTime,
  formatDateShort,
  formatDateTimeShort,
  getTodayISODate,
  getYesterdayISODate,
} from "@lib/utils/dateUtils";

describe("dateUtils UTC to IST Parser & Formatters", () => {
  const utcSample = "2026-08-20T08:07:47.830932";
  const utcWithSpace = "2026-08-20 08:07:47";

  it("parseUTCDate correctly parses UTC strings with or without Z or spaces", () => {
    const d1 = parseUTCDate(utcSample);
    expect(d1).not.toBeNull();
    expect(d1?.getUTCFullYear()).toBe(2026);
    expect(d1?.getUTCMonth()).toBe(7); // Aug
    expect(d1?.getUTCDate()).toBe(20);
    expect(d1?.getUTCHours()).toBe(8);
    expect(d1?.getUTCMinutes()).toBe(7);

    const d2 = parseUTCDate(utcWithSpace);
    expect(d2).not.toBeNull();
    expect(d2?.getUTCHours()).toBe(8);

    const d3 = parseUtcToIst("2026-08-20T08:07:47Z");
    expect(d3).not.toBeNull();
    expect(d3?.getUTCHours()).toBe(8);
  });

  it("formats UTC datetime string to IST date and time correctly (+05:30)", () => {
    // 08:07:47 UTC + 05:30 = 13:37:47 (01:37 PM IST) on 20 Aug 2026
    expect(formatDate(utcSample)).toBe("20 Aug 2026");
    expect(formatTime(utcSample)).toBe("01:37 PM");
    expect(formatLongDate(utcSample)).toBe("20 Aug 2026");
    expect(formatLongTime(utcSample)).toBe("1:37 PM");
    expect(formatDateTime(utcSample)).toBe("20 Aug 2026, 01:37 PM");
  });

  it("formatDateShort and formatDateTimeShort format in IST", () => {
    expect(formatDateShort(utcSample)).toBe("20/08/2026");
    expect(formatDateTimeShort(utcSample)).toContain("20/08/2026");
    expect(formatDateTimeShort(utcSample)).toContain("01:37");
  });

  it("handles day boundary change across UTC and IST", () => {
    // 2026-08-20 20:00:00 UTC + 5:30 -> 2026-08-21 01:30:00 AM IST
    const lateUtc = "2026-08-20T20:00:00.000";
    expect(formatDate(lateUtc)).toBe("21 Aug 2026");
    expect(formatTime(lateUtc)).toBe("01:30 AM");
    expect(formatDateTime(lateUtc)).toBe("21 Aug 2026, 01:30 AM");
  });

  it("getTodayISODate and getYesterdayISODate return valid YYYY-MM-DD strings", () => {
    const today = getTodayISODate();
    const yesterday = getYesterdayISODate();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(yesterday).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("safely handles null, undefined, empty, and invalid values", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate("")).toBe("—");
    expect(formatDate("invalid-date", "N/A")).toBe("N/A");
    expect(formatTime(null)).toBe("—");
    expect(formatDateTime(null)).toBe("—");
  });
});

describe("formatDateDDMMYYYY safe date formatter", () => {
  it("formats standard ISO string (YYYY-MM-DD) correctly", () => {
    expect(formatDateDDMMYYYY("2024-08-19")).toBe("19-08-2024");
    expect(formatDateDDMMYYYY("1995-12-05")).toBe("05-12-1995");
    expect(formatDateDDMMYYYY("2000-01-01")).toBe("01-01-2000");
  });

  it("formats ISO timestamp with timezone correctly without day shift", () => {
    expect(formatDateDDMMYYYY("2024-08-19T00:00:00.000Z")).toBe("19-08-2024");
  });

  it("handles DD-MM-YYYY or DD/MM/YYYY inputs nicely", () => {
    expect(formatDateDDMMYYYY("19-08-2024")).toBe("19-08-2024");
    expect(formatDateDDMMYYYY("5/12/1995")).toBe("05-12-1995");
  });

  it("handles Date objects", () => {
    const d = new Date(2024, 7, 19); // Aug is month 7
    expect(formatDateDDMMYYYY(d)).toBe("19-08-2024");
  });

  it("safely handles null, undefined, empty string and N/A without throwing", () => {
    expect(formatDateDDMMYYYY(null)).toBe("—");
    expect(formatDateDDMMYYYY(undefined)).toBe("—");
    expect(formatDateDDMMYYYY("")).toBe("—");
    expect(formatDateDDMMYYYY("   ")).toBe("—");
    expect(formatDateDDMMYYYY("N/A")).toBe("—");
    expect(formatDateDDMMYYYY("null")).toBe("—");
    expect(formatDateDDMMYYYY("undefined")).toBe("—");
  });

  it("safely handles custom fallback", () => {
    expect(formatDateDDMMYYYY(null, "N/A")).toBe("N/A");
    expect(formatDateDDMMYYYY("invalid-date-string", "N/A")).toBe("N/A");
  });

  it("safely handles invalid date strings without crashing", () => {
    expect(formatDateDDMMYYYY("hello-world")).toBe("—");
    expect(formatDateDDMMYYYY("99999999999999999999")).toBe("—");
  });
});
