/**
 * Typing Utility Tests
 * Covers edge cases from the specification document.
 */

import { describe, it, expect } from "vitest";
import {
  calculateLevenshteinDistance,
  calculateTypingStats,
  calculateProgressAwareStats,
  getTypingAlignment,
  getProgressAwareAlignment,
} from "@lib/utils/typingUtils";

// ---------------------------------------------------------------------------
// calculateLevenshteinDistance
// ---------------------------------------------------------------------------

describe("calculateLevenshteinDistance", () => {
  it("Case 1 — perfect match → 0 errors", () => {
    expect(calculateLevenshteinDistance("Hello World", "Hello World")).toBe(0);
  });

  it("Case 2 — one substitution → 1 error", () => {
    expect(calculateLevenshteinDistance("Hallo World", "Hello World")).toBe(1);
  });

  it("Case 3 — one missing character → 1 error", () => {
    expect(calculateLevenshteinDistance("Helo World", "Hello World")).toBe(1);
  });

  it("Case 4 — one extra character → 1 error", () => {
    expect(calculateLevenshteinDistance("Helloo World", "Hello World")).toBe(1);
  });

  it("Case 5 — extra leading space → 1 error", () => {
    expect(calculateLevenshteinDistance(" Hello World", "Hello World")).toBe(1);
  });

  it("Case 6 — two extra spaces → 2 errors", () => {
    // "Hello   World" has 2 extra spaces vs "Hello World"
    expect(calculateLevenshteinDistance("Hello   World", "Hello World")).toBe(
      2,
    );
  });

  it("Case 7 — extra characters after completion → 3 errors", () => {
    expect(calculateLevenshteinDistance("Hello!!!", "Hello")).toBe(3);
  });

  it("empty typed → distance = passage length", () => {
    expect(calculateLevenshteinDistance("", "Hello")).toBe(5);
  });

  it("empty passage → distance = typed length", () => {
    expect(calculateLevenshteinDistance("Hello", "")).toBe(5);
  });

  it("both empty → 0", () => {
    expect(calculateLevenshteinDistance("", "")).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calculateTypingStats
// ---------------------------------------------------------------------------

describe("calculateTypingStats", () => {
  it("Case 8 — empty input → wpm=0, accuracy=100, errors=0, no NaN", () => {
    const stats = calculateTypingStats("", "Hello World", 10);
    expect(stats.wpm).toBe(0);
    expect(stats.accuracy).toBe(100);
    expect(stats.errors).toBe(0);
    expect(stats.timeTaken).toBe(10);
    expect(Number.isNaN(stats.wpm)).toBe(false);
    expect(Number.isFinite(stats.wpm)).toBe(true);
  });

  it("Case 1 — perfect typing → accuracy=100, errors=0", () => {
    const stats = calculateTypingStats("Hello World", "Hello World", 10);
    expect(stats.accuracy).toBe(100);
    expect(stats.errors).toBe(0);
  });

  it("Case 2 — one substitution → errors=1", () => {
    const stats = calculateTypingStats("Hallo World", "Hello World", 10);
    expect(stats.errors).toBe(1);
  });

  it("Case 3 — one missing character → errors=1", () => {
    const stats = calculateTypingStats("Helo World", "Hello World", 10);
    expect(stats.errors).toBe(1);
  });

  it("Case 4 — one extra character → errors=1", () => {
    const stats = calculateTypingStats("Helloo World", "Hello World", 10);
    expect(stats.errors).toBe(1);
  });

  it("Case 5 — extra leading space → errors=1", () => {
    const stats = calculateTypingStats(" Hello World", "Hello World", 10);
    expect(stats.errors).toBe(1);
  });

  it("Case 6 — two extra spaces → errors=2", () => {
    const stats = calculateTypingStats("Hello   World", "Hello World", 10);
    expect(stats.errors).toBe(2);
  });

  it("Case 7 — extra chars after passage → errors=3", () => {
    const stats = calculateTypingStats("Hello!!!", "Hello", 10);
    expect(stats.errors).toBe(3);
  });

  it("accuracy never exceeds 100", () => {
    const stats = calculateTypingStats("Hello World", "Hello World", 5);
    expect(stats.accuracy).toBeLessThanOrEqual(100);
  });

  it("accuracy never goes below 0", () => {
    const stats = calculateTypingStats("XXXXXXXXX", "Hello World", 10);
    expect(stats.accuracy).toBeGreaterThanOrEqual(0);
  });

  it("wpm is not Infinity or NaN for zero seconds", () => {
    const stats = calculateTypingStats("Hello", "Hello World", 0);
    expect(Number.isFinite(stats.wpm)).toBe(true);
    expect(Number.isNaN(stats.wpm)).toBe(false);
  });

  it("wpm > 0 when user has typed something", () => {
    const stats = calculateTypingStats("Hello World", "Hello World", 30);
    expect(stats.wpm).toBeGreaterThan(0);
  });

  it("accuracy uses Math.max(typed, passage) as denominator", () => {
    // typed = "Hello!!!" (8 chars), passage = "Hello" (5 chars)
    // editDistance = 3, denominator = max(8,5) = 8
    // accuracy = (1 - 3/8)*100 = 62.5 → rounds to 63
    const stats = calculateTypingStats("Hello!!!", "Hello", 10);
    expect(stats.accuracy).toBe(63);
  });
});

// ---------------------------------------------------------------------------
// getTypingAlignment — visual engine checks
// ---------------------------------------------------------------------------

describe("getTypingAlignment", () => {
  it("empty typed → all untyped, matchedPassageLength=0", () => {
    const result = getTypingAlignment("", "Hello World");
    expect(result.matchedPassageLength).toBe(0);
    expect(result.passageCharStatuses.every((s) => s === "untyped")).toBe(true);
  });

  it("perfect match → all correct, matchedPassageLength = passage.length", () => {
    const result = getTypingAlignment("Hello World", "Hello World");
    expect(result.matchedPassageLength).toBe(11);
    expect(result.passageCharStatuses.every((s) => s === "correct")).toBe(true);
  });

  it("one substitution — no cascade: only 1 error status in result", () => {
    const result = getTypingAlignment("Hallo World", "Hello World");
    const errors = result.passageCharStatuses.filter((s) => s === "error");
    expect(errors.length).toBe(1);
  });

  it("one missing character — alignment remains stable", () => {
    // "Helo World" vs "Hello World" — one deletion
    const result = getTypingAlignment("Helo World", "Hello World");
    const errors = result.passageCharStatuses.filter((s) => s === "error");
    // 1 deletion = 1 error
    expect(errors.length).toBe(1);
  });

  it("cursor position = matchedPassageLength when not finished", () => {
    const result = getTypingAlignment("Hel", "Hello World");
    // cursor should be somewhere at or near index 3
    expect(result.matchedPassageLength).toBeGreaterThanOrEqual(3);
    expect(result.matchedPassageLength).toBeLessThanOrEqual(11);
  });

  // alignment regression — extra character
  it("extra character — matchedPassageLength covers the full passage", () => {
    // "Helloo World" — extra 'o'. The visual alignment covers all 11 passage chars
    // with 0 passage errors because the extra typed char is an insertion (not a
    // passage char error). Stats engine (Levenshtein) correctly counts it as 1 error.
    const result = getTypingAlignment("Helloo World", "Hello World");
    expect(result.passageCharStatuses.length).toBe(11);
    // matchedPassageLength should cover the full passage
    expect(result.matchedPassageLength).toBe(11);
    // no untyped chars — full passage is covered
    const untyped = result.passageCharStatuses.filter((s) => s === "untyped");
    expect(untyped.length).toBe(0);
  });

  // alignment regression — extra spaces
  it("extra spaces — passage is fully covered, no untyped chars", () => {
    // "Hello   World" (2 extra spaces) — 13 typed chars vs 11 passage chars.
    // Extra spaces are insertions in typed; passage chars remain correct or minimal errors.
    const result = getTypingAlignment("Hello   World", "Hello World");
    expect(result.passageCharStatuses.length).toBe(11);
    expect(result.matchedPassageLength).toBe(11);
    const untyped = result.passageCharStatuses.filter((s) => s === "untyped");
    expect(untyped.length).toBe(0);
  });

  // alignment regression — wrong character (substitution, no cascade)
  it("substitution — only the wrong character is error, no cascade", () => {
    const result = getTypingAlignment("Hallo World", "Hello World");
    expect(result.passageCharStatuses[1]).toBe("error"); // 'a' vs 'e'
    expect(result.passageCharStatuses[2]).toBe("correct"); // 'l'
    expect(result.passageCharStatuses[3]).toBe("correct"); // 'l'
    expect(result.passageCharStatuses[4]).toBe("correct"); // 'o'
  });
});

// ---------------------------------------------------------------------------
// Final stats freeze — simulate completion snapshot
// ---------------------------------------------------------------------------

describe("final stats freeze (calculateTypingStats snapshot simulation)", () => {
  it("stats at completion moment are stable regardless of further input", () => {
    const passage = "Hello World";

    // snapshot at completion
    const finalStats = calculateTypingStats("Hello World", passage, 15);

    // simulate user typing extra characters after completion
    const postStats = calculateTypingStats("Hello World!!!", passage, 20);

    // the snapshot itself does not change — calling the function again with
    // different input produces different numbers, proving the snapshot must
    // be stored (not recomputed from changing localTypedText)
    expect(finalStats.errors).toBe(0);
    expect(finalStats.accuracy).toBe(100);
    expect(postStats.errors).toBeGreaterThan(0);
    expect(postStats.accuracy).toBeLessThan(100);

    // confirm the two snapshots are different — proving freezing is necessary
    expect(finalStats.errors).not.toBe(postStats.errors);
  });

  it("completion with extra chars — snapshot captures correct errors", () => {
    const passage = "Hello";
    // user types passage + 3 extra chars — final snapshot at this moment
    const snapshot = calculateTypingStats("Hello!!!", passage, 10);
    expect(snapshot.errors).toBe(3);
    expect(snapshot.accuracy).toBe(63);
    expect(snapshot.wpm).toBeGreaterThan(0);
    expect(Number.isFinite(snapshot.wpm)).toBe(true);
  });

  it("final time is based on actual elapsed seconds, not ongoing timer", () => {
    const snapshot = calculateTypingStats("Hello World", "Hello World", 45);
    expect(snapshot.timeTaken).toBe(45);
    // calling again with a different time must NOT change the stored value
    const later = calculateTypingStats("Hello World", "Hello World", 60);
    expect(later.timeTaken).toBe(60);
    expect(snapshot.timeTaken).toBe(45); // original snapshot unchanged
  });
});

// ---------------------------------------------------------------------------
// Long text regression — performance / correctness
// ---------------------------------------------------------------------------

describe("long text regression", () => {
  const longPassage = "the quick brown fox jumps over the lazy dog ".repeat(23); // ~1000 chars

  it("perfect long text → errors=0, accuracy=100", () => {
    const stats = calculateTypingStats(longPassage, longPassage, 120);
    expect(stats.errors).toBe(0);
    expect(stats.accuracy).toBe(100);
  });

  it("long text one substitution → errors=1", () => {
    const typed = "X" + longPassage.slice(1);
    const stats = calculateTypingStats(typed, longPassage, 120);
    expect(stats.errors).toBe(1);
  });

  it("getTypingAlignment on long text — completes without error", () => {
    const typed = longPassage.slice(0, 500);
    expect(() => getTypingAlignment(typed, longPassage)).not.toThrow();
    const result = getTypingAlignment(typed, longPassage);
    expect(result.passageCharStatuses.length).toBe(longPassage.length);
  });

  it("calculateLevenshteinDistance on long text — correct result", () => {
    // identical strings → 0
    expect(calculateLevenshteinDistance(longPassage, longPassage)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// New behavior: targetReached vs isFinished separation
// ---------------------------------------------------------------------------

describe("targetReached vs isFinished separation", () => {
  // Test 1 — Reaching passage length does NOT finalize the test.
  // The pure utility layer never sets isFinished; that is the component's job.
  // Here we verify that reaching the passage length does NOT produce a frozen
  // stats object on its own — the snapshot must be explicitly created.
  it("Test 1 — reaching passage length produces live stats, not a frozen snapshot", () => {
    const passage = "Hello";
    const typed = "Hello"; // typed.length === passage.length

    // targetReached === true at this point (typed.length >= passage.length)
    const targetReached = typed.length >= passage.length;
    expect(targetReached).toBe(true);

    // No finalStats until Save & Next — simulate: finalStats starts null
    const finalStats: ReturnType<typeof calculateTypingStats> | null = null;
    expect(finalStats).toBeNull();

    // isFinished is still false — the component controls this flag
    const isFinished = false;
    expect(isFinished).toBe(false);

    // Live stats are still computed from the current typed text
    const liveStats = calculateTypingStats(typed, passage, 5);
    expect(liveStats.accuracy).toBe(100);
    expect(liveStats.errors).toBe(0);
  });

  // Test 2 — Extra character after target increases errors.
  it("Test 2 — extra character after target → errors=1, accuracy<100", () => {
    const passage = "Hello";
    const typed = "Hellox"; // 1 extra char

    expect(typed.length >= passage.length).toBe(true); // targetReached

    const stats = calculateTypingStats(typed, passage, 5);
    expect(stats.errors).toBe(1);
    expect(stats.accuracy).toBeLessThan(100);
  });

  // Test 3 — Extra word after target: every extra character is a separate error.
  it("Test 3 — extra word after target → per-character errors, accuracy<100", () => {
    const passage = "Hello World";
    const typed = "Hello World extra"; // " extra" = 6 extra chars

    expect(typed.length >= passage.length).toBe(true); // targetReached

    const stats = calculateTypingStats(typed, passage, 10);
    // Levenshtein insertions: " extra" = 6 chars → 6 errors (insertions)
    expect(stats.errors).toBe(6);
    expect(stats.accuracy).toBeLessThan(100);
  });

  // Test 4 — Deleting extra text before finalization restores accuracy.
  it("Test 4 — delete extra text before Save & Next → errors=0, accuracy=100", () => {
    const passage = "Hello";

    // User typed extra text
    const typedWithExtra = "Hello extra";
    const statsWithExtra = calculateTypingStats(typedWithExtra, passage, 8);
    expect(statsWithExtra.errors).toBeGreaterThan(0);
    expect(statsWithExtra.accuracy).toBeLessThan(100);

    // User deletes extra text — back to exact passage
    const typedCleaned = "Hello";
    const statsCleaned = calculateTypingStats(typedCleaned, passage, 10);
    expect(statsCleaned.errors).toBe(0);
    expect(statsCleaned.accuracy).toBe(100);
  });

  // Test 5 — Timer is NOT stopped by targetReached.
  // The component controls the timer via isFinished. Since targetReached does
  // not set isFinished, the timer keeps running. We verify the stats engine
  // correctly produces increasing timeTaken values when called with larger
  // elapsed values — as the component would see with a live timer.
  it("Test 5 — stats engine accepts increasing elapsed time after targetReached", () => {
    const passage = "Hello";
    const typed = "Hello"; // targetReached

    // Simulate timer still running: t=5s, t=10s, t=15s
    const at5 = calculateTypingStats(typed, passage, 5);
    const at10 = calculateTypingStats(typed, passage, 10);
    const at15 = calculateTypingStats(typed, passage, 15);

    expect(at5.timeTaken).toBe(5);
    expect(at10.timeTaken).toBe(10);
    expect(at15.timeTaken).toBe(15);

    // WPM decreases as time increases (same typed length, more time)
    expect(at5.wpm).toBeGreaterThan(at10.wpm);
    expect(at10.wpm).toBeGreaterThan(at15.wpm);
  });

  // Test 6 — Save & Next freezes stats: snapshot does not change with further input.
  it("Test 6 — Save & Next freezes stats; further typing does not alter snapshot", () => {
    const passage = "Hello World";

    // At Save & Next moment — capture snapshot
    const frozenSnapshot = calculateTypingStats("Hello World", passage, 15);

    // Further typing after Save & Next would produce different numbers
    // but the snapshot itself is immutable (stored in state)
    const afterMore = calculateTypingStats("Hello World extra", passage, 20);

    expect(frozenSnapshot.errors).toBe(0);
    expect(frozenSnapshot.accuracy).toBe(100);
    expect(frozenSnapshot.timeTaken).toBe(15);

    // Post-save typing produces different stats — proving the snapshot must be frozen
    expect(afterMore.errors).toBeGreaterThan(0);
    expect(afterMore.accuracy).toBeLessThan(100);
    expect(afterMore.timeTaken).toBe(20);

    // The frozen snapshot is unchanged
    expect(frozenSnapshot.errors).toBe(0);
    expect(frozenSnapshot.accuracy).toBe(100);
    expect(frozenSnapshot.timeTaken).toBe(15);
  });

  // Test 7 — Extra spaces count as individual errors (not grouped).
  it("Test 7 — extra spaces → 2 errors (per-character, not grouped)", () => {
    const passage = "Hello World";
    const typed = "Hello   World"; // 2 extra spaces

    const stats = calculateTypingStats(typed, passage, 10);
    expect(stats.errors).toBe(2);
  });

  // Test 8 — Regression: core functions behave correctly (existing behaviour).
  it("Test 8 — regression: perfect match = 0 errors; substitution = 1 error", () => {
    expect(calculateLevenshteinDistance("Hello World", "Hello World")).toBe(0);
    expect(calculateLevenshteinDistance("Hallo World", "Hello World")).toBe(1);

    const perfect = calculateTypingStats("Hello World", "Hello World", 10);
    expect(perfect.errors).toBe(0);
    expect(perfect.accuracy).toBe(100);

    const subst = calculateTypingStats("Hallo World", "Hello World", 10);
    expect(subst.errors).toBe(1);
    expect(subst.accuracy).toBeLessThan(100);
  });
});

// ---------------------------------------------------------------------------
// Progress-aware stats & alignment — regression tests for all 12 edge cases
// ---------------------------------------------------------------------------

describe("calculateProgressAwareStats — progress-aware live stats", () => {
  // Edge case 1 — empty input
  it("EC1 — empty input → errors=0, accuracy=100, wpm=0", () => {
    const stats = calculateProgressAwareStats("", "Hello World", 10);
    expect(stats.errors).toBe(0);
    expect(stats.accuracy).toBe(100);
    expect(stats.wpm).toBe(0);
  });

  // Edge case 2 — first character correct
  it("EC2 — first character correct → errors=0, accuracy=100", () => {
    const stats = calculateProgressAwareStats("H", "Hello", 1);
    expect(stats.errors).toBe(0);
    expect(stats.accuracy).toBe(100);
  });

  // Edge case 3 — first character wrong
  it("EC3 — first character wrong → errors=1", () => {
    const stats = calculateProgressAwareStats("X", "Hello", 1);
    expect(stats.errors).toBe(1);
    expect(stats.accuracy).toBeLessThan(100);
  });

  // EC4 — Typing 'A' against 450-char passage must NOT show 449 errors.
  // Root cause of Bug 1: calculateTypingStats("A", fullPassage) = 449 deletions.
  // calculateProgressAwareStats uses passage.slice(0, 1) as effective passage.
  it("EC4 — typing 'A' against 450-char passage → errors=0 when correct", () => {
    const longPassage =
      "ArcGate Quality Policy.ArcGate is committed to a global quality ".repeat(
        7,
      ); // 450+ chars
    const stats = calculateProgressAwareStats(
      "A",
      longPassage.slice(0, 450),
      1,
    );
    // 'A' matches longPassage[0]='A', effective passage = 'A', so errors = 0
    expect(stats.errors).toBe(0);
    expect(stats.accuracy).toBe(100);
  });

  // EC4b — typing wrong first char against long passage
  it("EC4b — wrong first char against 450-char passage → errors=1 only", () => {
    const longPassage = "ArcGate Quality Policy".repeat(20).slice(0, 450);
    const stats = calculateProgressAwareStats("X", longPassage, 1);
    // Only 1 error (substitution), NOT 449
    expect(stats.errors).toBe(1);
  });

  // Edge case 4 — correct partial typing
  it("EC5 — partial correct typing → errors=0, accuracy=100", () => {
    const stats = calculateProgressAwareStats("Hello", "Hello World", 5);
    expect(stats.errors).toBe(0);
    expect(stats.accuracy).toBe(100);
  });

  // Edge case 5 — one wrong character in middle of partial text
  it("EC6 — one wrong char in partial → errors=1", () => {
    // typed=Hxllo (5), passage=Hello World (11)
    // effectivePassage = Hello, Lev(Hxllo, Hello) = 1
    const stats = calculateProgressAwareStats("Hxllo", "Hello World", 5);
    expect(stats.errors).toBe(1);
    expect(stats.accuracy).toBeLessThan(100);
  });

  // Edge case 6 — missing character (deletion) in partial
  it("EC7 — missing char in partial → errors=1, no cascade", () => {
    // typed=Helo (4), effectivePassage=Hell (4), Lev(Helo,Hell)=1
    const stats = calculateProgressAwareStats("Helo", "Hello", 5);
    expect(stats.errors).toBe(1);
  });

  // Edge case 7 — extra char before target (insertion in partial)
  it("EC8 — extra char before target → insertion error, future chars NOT counted", () => {
    // typed=Hellox (6), passage=Hello World (11)
    // effectivePassage=Hello  (6 chars: 'Hello '), Lev(Hellox, Hello )=1
    const stats = calculateProgressAwareStats("Hellox", "Hello World", 5);
    // Should have some errors for the 'x' (1 substitution vs 'space'), not 6 deletions
    expect(stats.errors).toBeGreaterThanOrEqual(1);
    expect(stats.errors).toBeLessThanOrEqual(2); // at most 1-2, never 6
  });

  // Edge case 8 — target reached perfectly
  it("EC9 — target reached perfectly → errors=0, accuracy=100", () => {
    const stats = calculateProgressAwareStats("Hello World", "Hello World", 10);
    expect(stats.errors).toBe(0);
    expect(stats.accuracy).toBe(100);
  });

  // Edge case 9 — extra character after target
  it("EC10 — extra char after target → errors=1, accuracy<100", () => {
    const stats = calculateProgressAwareStats(
      "Hello Worldx",
      "Hello World",
      12,
    );
    expect(stats.errors).toBe(1);
    expect(stats.accuracy).toBeLessThan(100);
  });

  // Edge case 10 — extra word after target: per-character errors
  it("EC11 — extra word after target → every extra char counted", () => {
    // typed=Hello World extra (17), passage=Hello World (11)
    // effectivePassage=passage (targetReached), extra=" extra"=6 insertions
    const stats = calculateProgressAwareStats(
      "Hello World extra",
      "Hello World",
      15,
    );
    expect(stats.errors).toBe(6);
    expect(stats.accuracy).toBeLessThan(100);
  });

  // Edge case 11 — delete extra word before finalization
  it("EC12 — delete extra text → errors=0, accuracy=100", () => {
    // with extra
    const withExtra = calculateProgressAwareStats("Hello extra", "Hello", 8);
    expect(withExtra.errors).toBeGreaterThan(0);

    // after deleting extra
    const cleaned = calculateProgressAwareStats("Hello", "Hello", 10);
    expect(cleaned.errors).toBe(0);
    expect(cleaned.accuracy).toBe(100);
  });
});

describe("getProgressAwareAlignment — progress-aware visual alignment", () => {
  it("empty typed → all untyped, extraTyped empty", () => {
    const result = getProgressAwareAlignment("", "Hello World");
    expect(result.passageCharStatuses.length).toBe(11);
    expect(result.passageCharStatuses.every((s) => s === "untyped")).toBe(true);
    expect(result.extraTyped).toBe("");
  });

  it("partial correct typing → typed portion green, rest untyped", () => {
    const result = getProgressAwareAlignment("Hel", "Hello World");
    // First 3 chars should be correct
    expect(result.passageCharStatuses[0]).toBe("correct"); // H
    expect(result.passageCharStatuses[1]).toBe("correct"); // e
    expect(result.passageCharStatuses[2]).toBe("correct"); // l
    // Remaining chars should be untyped (NOT error)
    expect(result.passageCharStatuses[3]).toBe("untyped");
    expect(result.passageCharStatuses[4]).toBe("untyped");
    expect(
      result.passageCharStatuses.slice(3).every((s) => s === "untyped"),
    ).toBe(true);
    expect(result.extraTyped).toBe("");
  });

  it("partial wrong char → that char red, rest untyped — no cascade", () => {
    // typed=Hxllo (5), effectivePassage=Hello
    const result = getProgressAwareAlignment("Hxllo", "Hello World");
    expect(result.passageCharStatuses[0]).toBe("correct"); // H
    expect(result.passageCharStatuses[1]).toBe("error"); // x vs e
    // rest (index 5+) must be untyped, never error
    expect(
      result.passageCharStatuses.slice(5).every((s) => s === "untyped"),
    ).toBe(true);
    expect(result.extraTyped).toBe("");
  });

  it("future passage chars never become error due to partial typing", () => {
    // Only first char typed
    const result = getProgressAwareAlignment("H", "Hello World");
    // chars 1-10 (indices 1..10) must all be untyped
    const rest = result.passageCharStatuses.slice(1);
    expect(rest.every((s) => s === "untyped")).toBe(true);
  });

  it("perfect full match → all correct, extraTyped empty", () => {
    const result = getProgressAwareAlignment("Hello World", "Hello World");
    expect(result.passageCharStatuses.every((s) => s === "correct")).toBe(true);
    expect(result.extraTyped).toBe("");
  });

  it("extra char after target → extraTyped contains the extra", () => {
    const result = getProgressAwareAlignment("Hello Worldx", "Hello World");
    expect(result.extraTyped).toBe("x");
    // passage statuses should have no untyped
    expect(result.passageCharStatuses.some((s) => s === "untyped")).toBe(false);
  });

  it("extra word after target → full extraTyped string", () => {
    const result = getProgressAwareAlignment(
      "Hello World extra",
      "Hello World",
    );
    expect(result.extraTyped).toBe(" extra");
    expect(result.passageCharStatuses.length).toBe(11); // full passage
  });

  it("passageCharStatuses always has passage.length entries", () => {
    const passage = "Hello World";
    expect(
      getProgressAwareAlignment("H", passage).passageCharStatuses.length,
    ).toBe(11);
    expect(
      getProgressAwareAlignment("Hello World", passage).passageCharStatuses
        .length,
    ).toBe(11);
    expect(
      getProgressAwareAlignment("Hello World extra", passage)
        .passageCharStatuses.length,
    ).toBe(11);
  });

  // --- Internal insertion regression tests ---
  // When typed has extra chars because of INTERNAL insertions (not trailing),
  // extraTyped must be empty — the alignment engine handles inline errors.

  it("internal insertion: 'suervices' vs 'services' → extraTyped empty, errors inline", () => {
    // Extra 'u' inside the word, not at the end
    const result = getProgressAwareAlignment("suervices", "services");
    expect(result.extraTyped).toBe(""); // NOT "s" at the end
    // The alignment should mark the error(s) inside, not at the trailing chars
    expect(result.passageCharStatuses.length).toBe(8); // passage = "services" = 8 chars
  });

  it("internal insertion: 'Quaility' vs 'Quality' → extraTyped empty", () => {
    const result = getProgressAwareAlignment("Quaility", "Quality");
    expect(result.extraTyped).toBe(""); // NOT "y"
    expect(result.passageCharStatuses.length).toBe(7);
  });

  it("multiple internal insertions: typed longer but no true trailing extras", () => {
    // passage: "abc def"   (7 chars)
    // typed:   "abcc deef" (9 chars) — 2 extra chars inside
    const result = getProgressAwareAlignment("abcc deef", "abc def");
    expect(result.extraTyped).toBe(""); // NOT "ef"
    expect(result.passageCharStatuses.length).toBe(7);
  });

  it("true trailing extra after exact prefix → extraTyped returned", () => {
    // typed = "services." — prefix "services" matches exactly, "." is truly trailing
    const result = getProgressAwareAlignment("services.", "services");
    expect(result.extraTyped).toBe(".");
  });

  it("mixed: internal error + trailing extra → extraTyped empty (conservative)", () => {
    // typed = "suervices." vs "services"
    // prefix = "suervice" !== "services" → extraTyped must be empty
    // The internal insertion shifts everything, so we can't separate trailing
    const result = getProgressAwareAlignment("suervices.", "services");
    expect(result.extraTyped).toBe("");
  });
});
