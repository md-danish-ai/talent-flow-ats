/**
 * Typing Test Alignment & Statistics Calculator
 * Uses Levenshtein Distance and Word Token Alignment for typing test evaluation.
 * Prevents single space/period insertion from cascading into 100% false errors.
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

/**
 * Calculates Levenshtein Edit Distance between two strings
 */
export function calculateLevenshteinDistance(
  str1: string,
  str2: string,
): number {
  const m = str1.length;
  const n = str2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    const char1 = str1[i - 1];
    for (let j = 1; j <= n; j++) {
      const cost = char1 === str2[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1, // deletion
        curr[j - 1] + 1, // insertion
        prev[j - 1] + cost, // substitution
      );
    }
    const temp = prev;
    prev = curr;
    curr = temp;
  }

  return prev[n];
}

/**
 * Computes typing statistics (WPM, Accuracy, Errors)
 */
export interface AlignmentResult {
  editDistance: number;
  matchedPassageLength: number;
  passageCharStatuses: ("correct" | "error" | "untyped")[];
}

/**
 * Computes Levenshtein alignment between typed text and passage using DP.
 * Handles insertions (extra spaces), deletions (missing characters), and substitutions
 * without cascading index offset errors.
 */
export function getTypingAlignment(
  typed: string,
  passage: string,
): AlignmentResult {
  const safeTyped = typed || "";
  const safePassage = passage || "";
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

  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 0; i <= m; i++) dp[i * width] = i;

  for (let i = 1; i <= m; i++) {
    const charTyped = safeTyped[i - 1];
    const rowOffset = i * width;
    const prevRowOffset = (i - 1) * width;

    for (let j = 1; j <= n; j++) {
      const cost = charTyped === safePassage[j - 1] ? 0 : 1;
      const delCost = dp[prevRowOffset + j] + 1;
      const insCost = dp[rowOffset + j - 1] + 1;
      const subCost = dp[prevRowOffset + j - 1] + cost;

      dp[rowOffset + j] = Math.min(delCost, insCost, subCost);
    }
  }

  const lastRowOffset = m * width;
  let bestJ = m <= n ? m : n;
  let minEditDist = dp[lastRowOffset + bestJ];

  for (let j = 1; j <= n; j++) {
    const val = dp[lastRowOffset + j];
    if (val < minEditDist) {
      minEditDist = val;
      bestJ = j;
    } else if (val === minEditDist && Math.abs(j - m) < Math.abs(bestJ - m)) {
      bestJ = j;
    }
  }

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
      passageStatuses[j - 1] = cost === 0 ? "correct" : "error";
      i--;
      j--;
    } else if (currentVal === dp[prevOffset + j] + 1) {
      i--;
    } else {
      passageStatuses[j - 1] = "error";
      j--;
    }
  }

  while (j > 0) {
    passageStatuses[j - 1] = "error";
    j--;
  }

  return {
    editDistance: minEditDist,
    matchedPassageLength: bestJ,
    passageCharStatuses: passageStatuses,
  };
}

/**
 * Computes typing statistics (WPM, Accuracy, Errors)
 */
export function calculateTypingStats(
  typed: string,
  passage: string,
  timeTakenSeconds: number,
): TypingStats {
  const safeTyped = typed || "";
  const safePassage = passage || "";

  const typedLen = safeTyped.length;

  if (typedLen === 0) {
    return {
      wpm: 0,
      accuracy: 100,
      errors: 0,
      timeTaken: Math.round(timeTakenSeconds),
    };
  }

  const { editDistance, matchedPassageLength } = getTypingAlignment(
    safeTyped,
    safePassage,
  );

  const maxLen = Math.max(typedLen, matchedPassageLength);
  const rawAccuracy = maxLen === 0 ? 100 : (1 - editDistance / maxLen) * 100;
  const accuracy = Math.max(0, Math.min(100, Math.round(rawAccuracy)));

  const errors = editDistance;

  const words = safeTyped.length / 5;
  const minutes = Math.max(timeTakenSeconds, 0.1) / 60;
  const wpm = Math.round(words / minutes);

  return {
    wpm,
    accuracy,
    errors,
    timeTaken: Math.round(timeTakenSeconds),
  };
}

/**
 * Computes word-level alignment diff tokens for clean visual highlighting
 */
export function getTypingDiffTokens(
  typed: string,
  passage: string,
): DiffToken[] {
  if (!typed) return [];

  const typedWords = typed.split(/(\s+)/);
  const passageWords = passage.split(/(\s+)/);

  const tokens: DiffToken[] = [];
  let passageIdx = 0;

  for (let i = 0; i < typedWords.length; i++) {
    const word = typedWords[i];
    if (!word) continue;

    const target = passageWords[passageIdx];

    if (target !== undefined && word === target) {
      tokens.push({ text: word, isCorrect: true });
      passageIdx++;
    } else if (target !== undefined && word.trim() === target.trim()) {
      tokens.push({ text: word, isCorrect: true });
      passageIdx++;
    } else {
      let foundMatchIdx = -1;
      for (
        let k = passageIdx;
        k < Math.min(passageIdx + 3, passageWords.length);
        k++
      ) {
        if (
          passageWords[k] === word ||
          passageWords[k]?.trim() === word.trim()
        ) {
          foundMatchIdx = k;
          break;
        }
      }

      if (foundMatchIdx !== -1) {
        passageIdx = foundMatchIdx + 1;
        tokens.push({ text: word, isCorrect: true });
      } else {
        tokens.push({ text: word, isCorrect: false });
        if (passageIdx < passageWords.length) {
          passageIdx++;
        }
      }
    }
  }

  return tokens;
}
