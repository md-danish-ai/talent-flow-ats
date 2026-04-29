export interface ParsedOption {
  optionLabel: string;
  optionText: string;
  isCorrect: boolean;
}

export const normalizeText = (value?: string | null) =>
  (value || "").trim().toLowerCase();

export const extractOptionKey = (value?: string | null) => {
  if (!value) return "";
  const match = value.trim().match(/^([a-z0-9]+)\s*[\.\):\-]?/i);
  return match ? match[1].toUpperCase() : "";
};

export const parseQuestionOptions = (
  options: Array<Record<string, unknown>> | null | undefined,
) => {
  if (!Array.isArray(options)) return [] as ParsedOption[];

  return options.map((raw, index) => ({
    optionLabel: String(
      raw.option_label ?? String.fromCharCode(65 + index),
    ).toUpperCase(),
    optionText: String(raw.option_text ?? ""),
    isCorrect: Boolean(raw.is_correct),
  }));
};
