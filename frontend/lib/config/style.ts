/**
 * Centralized Style Configuration for Talent Flow ATS.
 * Change these Tailwind classes in one place to update border-radius across the entire application.
 */
export const STYLE_CONFIG = {
  // Border Radius classes: 'rounded-none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full'
  cardRadius: "rounded-2xl", // Outer Main Cards
  buttonRadius: "rounded-2xl", // Buttons, inputs, and clickables
  badgeRadius: "rounded-2xl", // Badges, indicator pills, and tag wrappers
  iconRadius: "rounded-2xl", // Inner icon background circles/squares
  innerCardRadius: "rounded-2xl", // Nested sub-cards (Options, stats lists)
};
export type StyleConfigType = typeof STYLE_CONFIG;
