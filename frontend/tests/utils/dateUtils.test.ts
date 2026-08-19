import { describe, it, expect } from "vitest";
import { formatDateDDMMYYYY } from "@lib/utils/dateUtils";

describe("formatDateDDMMYYYY safe date formatter", () => {
  it("formats standard ISO string (YYYY-MM-DD) correctly", () => {
    expect(formatDateDDMMYYYY("2024-08-19")).toBe("19-08-2024");
    expect(formatDateDDMMYYYY("1995-12-05")).toBe("05-12-1995");
    expect(formatDateDDMMYYYY("2000-01-01")).toBe("01-01-2000");
  });

  it("formats ISO timestamp with timezone correctly without day shift", () => {
    expect(formatDateDDMMYYYY("2024-08-19T00:00:00.000Z")).toBe("19-08-2024");
    expect(formatDateDDMMYYYY("2024-08-19T14:30:45")).toBe("19-08-2024");
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
