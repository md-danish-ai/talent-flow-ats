/**
 * Typing Test Alignment & Statistics Calculator
 * Uses Levenshtein Distance for both statistics and character-level highlighting.
 *
 * Design principles:
 * - Statistics engine (calculateTypingStats) is INDEPENDENT of visual alignment.
 * - Visual alignment (getTypingAlignment) is only for character-level highlighting.
 * - Accuracy denominator = Math.max(typed.length, passage.length) for correctness.
 * - Extra characters beyond passage length count as errors.
 * - Completion is decided by the component, not by character count.
 *
 * Progress-aware layer:
 * - calculateProgressAwareStats() — preferred for live UI stats.
 *   During partial typing: compares typed against passage.slice(0, typed.length)
 *   so untyped future characters are NEVER counted as deletion errors.
 *   After targetReached: compares full typed vs full passage so insertions count.
 * - getProgressAwareAlignment() — same prefix logic for visual highlighting.
 */

export interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  timeTaken: number;
}

export interface DiffToken {
  text: string;
  isCorrect: boolean;
}

// ---------------------------------------------------------------------------
// Core Levenshtein Distance — O(m*n) time, O(n) space
// Each insertion / deletion / substitution counts as exactly 1 error.
// ---------------------------------------------------------------------------

/**
 * Calculates the full Levenshtein edit distance between two strings.
 * Used by the STATISTICS engine only.
 */
export function calculateLevenshteinDistance(
  str1: string,
  str2: string,
): number {
  const m = str1.length;
  const n = str2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  // Rolling two-row DP — O(n) space
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    const char1 = str1[i - 1];
    for (let j = 1; j <= n; j++) {
      const cost = char1 === str2[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1, // deletion (passage char not typed)
        curr[j - 1] + 1, // insertion (extra char typed)
        prev[j - 1] + cost, // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}

// ---------------------------------------------------------------------------
// Statistics Engine — completely independent of visual alignment
// ---------------------------------------------------------------------------

/**
 * Computes typing statistics: WPM, accuracy, errors, timeTaken.
 *
 * Accuracy formula:
 *   accuracy = (1 - editDistance / Math.max(typed.length, passage.length)) * 100
 * clamped to [0, 100].
 *
 * NOTE: This function compares typed against the EXACT passage argument supplied.
 * For live UI stats during partial typing, use calculateProgressAwareStats()
 * which automatically applies the correct prefix slicing.
 */
export function calculateTypingStats(
  typed: string,
  passage: string,
  timeTakenSeconds: number,
  correctedErrors: number = 0,
  totalKeystrokes: number = 0,
): TypingStats {
  const safeTyped = typed ?? "";
  const safePassage = passage ?? "";

  // Empty input — well-defined initial state, no NaN/Infinity
  if (safeTyped.length === 0 && totalKeystrokes === 0) {
    return {
      wpm: 0,
      accuracy: 100,
      errors: 0,
      timeTaken: Math.max(0, Math.round(timeTakenSeconds)),
    };
  }

  // --- Errors via full Levenshtein (typed vs ENTIRE passage) ---
  const editDistance = calculateLevenshteinDistance(safeTyped, safePassage);
  const totalErrorsCommitted = editDistance + (correctedErrors ?? 0);

  // --- Accuracy ---
  // Denominator considers current typed length, passage length, and total keystrokes
  const denominator = Math.max(
    safeTyped.length,
    safePassage.length,
    totalKeystrokes ?? 0,
  );
  const rawAccuracy =
    denominator === 0 ? 100 : (1 - totalErrorsCommitted / denominator) * 100;
  const accuracy = Math.max(0, Math.min(100, Math.round(rawAccuracy)));

  // --- WPM ---
  const safeSecs = Math.max(timeTakenSeconds, 1);
  const minutes = safeSecs / 60;
  const words = safeTyped.length / 5;
  const wpm = Math.round(words / minutes);

  return {
    wpm,
    accuracy,
    errors: editDistance,
    timeTaken: Math.max(0, Math.round(timeTakenSeconds)),
  };
}

// ---------------------------------------------------------------------------
// Progress-aware statistics — for live UI during typing
// ---------------------------------------------------------------------------

/**
 * Computes live typing statistics with progress-aware passage comparison
 * and keystroke-based accuracy tracking (Monkeytype Real Accuracy).
 */
export function calculateProgressAwareStats(
  typed: string,
  passage: string,
  timeTakenSeconds: number,
  correctedErrors: number = 0,
  totalKeystrokes: number = 0,
): TypingStats {
  const safeTyped = typed ?? "";
  const safePassage = passage ?? "";

  // During partial typing: compare only against the typed-length prefix.
  // After targetReached: compare full typed vs full passage.
  const effectivePassage =
    safeTyped.length < safePassage.length
      ? safePassage.slice(0, safeTyped.length)
      : safePassage;

  return calculateTypingStats(
    safeTyped,
    effectivePassage,
    timeTakenSeconds,
    correctedErrors,
    totalKeystrokes,
  );
}

// ---------------------------------------------------------------------------
// Visual Alignment Engine — for character-level highlighting ONLY
// ---------------------------------------------------------------------------

export interface AlignmentResult {
  /**
   * Edit distance for alignment purposes only — do NOT use for statistics.
   */
  editDistance: number;

  /**
   * How many passage characters are "covered" by the current typed text.
   * Determines where the cursor indicator sits.
   */
  matchedPassageLength: number;

  /**
   * Per-character status for every passage character:
   *   "correct"  — user typed it correctly
   *   "error"    — user typed something wrong here (or skipped it)
   *   "untyped"  — user hasn't reached this character yet
   */
  passageCharStatuses: ("correct" | "error" | "untyped")[];
}

/**
 * Computes character-level alignment between typed text and passage using
 * a full DP Levenshtein matrix, then traces back the optimal path.
 *
 * Key behaviour:
 * - "Best J" is the passage index that achieves the lowest edit cost from
 *   the END of the typed text. This prevents a single wrong character from
 *   cascading all subsequent characters into error state.
 * - Characters past bestJ remain "untyped" (cursor lands there).
 * - Characters before bestJ are "correct" or "error" per the traceback.
 *
 * IMPORTANT: Do NOT use editDistance from this function for statistics.
 */
export function getTypingAlignment(
  typed: string,
  passage: string,
): AlignmentResult {
  const safeTyped = typed ?? "";
  const safePassage = passage ?? "";
  const m = safeTyped.length;
  const n = safePassage.length;

  if (m === 0) {
    return {
      editDistance: 0,
      matchedPassageLength: 0,
      passageCharStatuses: new Array<"untyped">(n).fill("untyped"),
    };
  }

  if (n === 0) {
    return {
      editDistance: m,
      matchedPassageLength: 0,
      passageCharStatuses: [],
    };
  }

  const width = n + 1;
  const dp = new Int32Array((m + 1) * width);

  // Initialise first row and column
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 0; i <= m; i++) dp[i * width] = i;

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    const charTyped = safeTyped[i - 1];
    const rowOffset = i * width;
    const prevRowOffset = (i - 1) * width;

    for (let j = 1; j <= n; j++) {
      const cost = charTyped === safePassage[j - 1] ? 0 : 1;
      dp[rowOffset + j] = Math.min(
        dp[prevRowOffset + j] + 1, // deletion
        dp[rowOffset + j - 1] + 1, // insertion
        dp[prevRowOffset + j - 1] + cost, // substitution
      );
    }
  }

  // Find best passage index (lowest edit cost in last typed row).
  const lastRowOffset = m * width;
  let bestJ = Math.min(m, n);
  let minCost = dp[lastRowOffset + bestJ];

  for (let j = 1; j <= n; j++) {
    const val = dp[lastRowOffset + j];
    if (
      val < minCost ||
      (val === minCost && Math.abs(j - m) < Math.abs(bestJ - m))
    ) {
      minCost = val;
      bestJ = j;
    }
  }

  // Traceback from (m, bestJ) to reconstruct per-character status
  const passageStatuses: ("correct" | "error" | "untyped")[] = new Array(
    n,
  ).fill("untyped");
  let i = m;
  let j = bestJ;

  while (i > 0 && j > 0) {
    const currOffset = i * width;
    const prevOffset = (i - 1) * width;
    const cost = safeTyped[i - 1] === safePassage[j - 1] ? 0 : 1;
    const currentVal = dp[currOffset + j];

    if (currentVal === dp[prevOffset + j - 1] + cost) {
      // Match or substitution
      const status = cost === 0 ? "correct" : "error";
      // Never overwrite an existing error with correct
      if (passageStatuses[j - 1] !== "error") {
        passageStatuses[j - 1] = status;
      }
      i--;
      j--;
    } else if (currentVal === dp[prevOffset + j] + 1) {
      // Insertion in typed text (user typed extra character)
      // Mark the corresponding passage character as error
      passageStatuses[Math.max(0, j - 1)] = "error";
      i--;
    } else {
      // Deletion in typed text (passage char skipped)
      passageStatuses[j - 1] = "error";
      j--;
    }
  }

  // Any remaining unmatched passage chars before j → errors
  while (j > 0) {
    passageStatuses[j - 1] = "error";
    j--;
  }

  return {
    editDistance: minCost,
    matchedPassageLength: bestJ,
    passageCharStatuses: passageStatuses,
  };
}

// ---------------------------------------------------------------------------
// Progress-aware visual alignment — for live character highlighting
// ---------------------------------------------------------------------------

/**
 * Progress-aware wrapper around getTypingAlignment for live character highlighting.
 *
 * THE KEY RULE (mirrors calculateProgressAwareStats):
 *   Before targetReached: align typed against passage.slice(0, typed.length) only.
 *   Future/untyped passage chars are padded back as "untyped" — never "error".
 *
 *   After targetReached: align full typed against full passage.
 *   Extra typed chars beyond passage.length are returned in extraTyped (red).
 *
 * Returns standard AlignmentResult (always passage.length statuses) plus
 * extraTyped string for the component to render as red spans.
 */
export function getProgressAwareAlignment(
  typed: string,
  passage: string,
): AlignmentResult & { extraTyped: string } {
  const safeTyped = typed ?? "";
  const safePassage = passage ?? "";

  if (safeTyped.length < safePassage.length) {
    // Partial typing: align against the typed-length prefix only.
    const prefix = safePassage.slice(0, safeTyped.length);
    const prefixResult = getTypingAlignment(safeTyped, prefix);

    // Pad passageCharStatuses back to full passage length with "untyped".
    const fullStatuses: ("correct" | "error" | "untyped")[] = [
      ...prefixResult.passageCharStatuses,
      ...new Array<"untyped">(safePassage.length - safeTyped.length).fill(
        "untyped",
      ),
    ];

    return {
      editDistance: prefixResult.editDistance,
      matchedPassageLength: prefixResult.matchedPassageLength,
      passageCharStatuses: fullStatuses,
      extraTyped: "",
    };
  }

  // targetReached or beyond: align full typed vs full passage.
  const result = getTypingAlignment(safeTyped, safePassage);

  // CRITICAL: Only treat trailing characters as "extraTyped" when the prefix
  // of the typed text (up to passage.length) EXACTLY matches the passage.
  // If the typed text is longer because of INTERNAL insertions (e.g. user
  // typed "suervices" instead of "services" — extra 'u' in the middle),
  // then the trailing characters are NOT extra — they're just shifted.
  // The alignment engine already marks the internal error correctly.
  //
  // Example: passage="...market.", typed="...Quaility...satishfaction...market."
  //   typed.length = 307, passage.length = 305
  //   Old code: extraTyped = typed.slice(305) = "t." → WRONG (shows "t." red)
  //   New code: typed.slice(0,305) !== passage → extraTyped = "" → CORRECT
  //             The 'i' in Quaility and 'h' in satishfaction are marked error inline.
  let extraTyped = "";
  if (safeTyped.length > safePassage.length) {
    const prefixOfTyped = safeTyped.slice(0, safePassage.length);
    if (prefixOfTyped === safePassage) {
      // Prefix matches perfectly → extra chars are truly appended at the end
      extraTyped = safeTyped.slice(safePassage.length);
    }
    // else: mismatches inside → errors are internal, no trailing extras
  }

  return { ...result, extraTyped };
}

// ---------------------------------------------------------------------------
// Typed text diff tokens — for visual highlighting in result views
// ---------------------------------------------------------------------------

/**
 * Computes character-level alignment diff tokens for visual highlighting of typed text.
 * Uses full Levenshtein DP traceback to accurately identify correct vs wrong characters
 * without losing sync on spacing or punctuation differences.
 */
export function getTypingDiffTokens(
  typed: string,
  passage: string,
): DiffToken[] {
  const safeTyped = typed ?? "";
  const safePassage = passage ?? "";
  const m = safeTyped.length;
  const n = safePassage.length;

  if (m === 0) return [];
  if (n === 0) return [{ text: safeTyped, isCorrect: false }];
  if (safeTyped === safePassage) return [{ text: safeTyped, isCorrect: true }];

  const width = n + 1;
  const dp = new Int32Array((m + 1) * width);

  // Initialise first row and column
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 0; i <= m; i++) dp[i * width] = i;

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    const charTyped = safeTyped[i - 1];
    const rowOffset = i * width;
    const prevRowOffset = (i - 1) * width;

    for (let j = 1; j <= n; j++) {
      const cost = charTyped === safePassage[j - 1] ? 0 : 1;
      dp[rowOffset + j] = Math.min(
        dp[prevRowOffset + j] + 1, // insertion in typed text
        dp[rowOffset + j - 1] + 1, // deletion in typed text (passage char skipped)
        dp[prevRowOffset + j - 1] + cost, // match or substitution
      );
    }
  }

  // Find best ending index in passage for traceback.
  let bestJ = n;
  if (m < n) {
    const lastRowOffset = m * width;
    let minCost = dp[lastRowOffset + n];
    for (let j = 1; j <= n; j++) {
      const val = dp[lastRowOffset + j];
      if (
        val < minCost ||
        (val === minCost && Math.abs(j - m) < Math.abs(bestJ - m))
      ) {
        minCost = val;
        bestJ = j;
      }
    }
  }

  // Traceback to determine status for each character in safeTyped (0..m-1)
  const isCorrectChar: boolean[] = new Array(m).fill(false);
  let i = m;
  let j = bestJ;

  while (i > 0 && j > 0) {
    const currOffset = i * width;
    const prevOffset = (i - 1) * width;
    const cost = safeTyped[i - 1] === safePassage[j - 1] ? 0 : 1;
    const currentVal = dp[currOffset + j];

    if (currentVal === dp[prevOffset + j - 1] + cost) {
      // Match or substitution
      isCorrectChar[i - 1] = cost === 0;
      i--;
      j--;
    } else if (currentVal === dp[prevOffset + j] + 1) {
      // Insertion in typed text (extra character typed)
      isCorrectChar[i - 1] = false;
      i--;
    } else {
      // Deletion in typed text (passage char skipped by user)
      j--;
    }
  }

  // Any remaining typed characters before j=0 are insertions/errors
  while (i > 0) {
    isCorrectChar[i - 1] = false;
    i--;
  }

  // Group contiguous characters with the same status into tokens
  const tokens: DiffToken[] = [];
  let currentText = "";
  let currentStatus: boolean | null = null;

  for (let idx = 0; idx < m; idx++) {
    const status = isCorrectChar[idx];
    if (currentStatus === null) {
      currentStatus = status;
      currentText = safeTyped[idx];
    } else if (status === currentStatus) {
      currentText += safeTyped[idx];
    } else {
      tokens.push({ text: currentText, isCorrect: currentStatus });
      currentStatus = status;
      currentText = safeTyped[idx];
    }
  }

  if (currentText.length > 0 && currentStatus !== null) {
    tokens.push({ text: currentText, isCorrect: currentStatus });
  }

  return tokens;
}
