// Task 1: the day and night palettes of the beach-tiles screen. The light set decides which roles exist...
export const lightColors = {
  page: '#fbf6ec',
  surface: '#ffffff',
  text: '#1f2a37',
  textMuted: '#5b6573',
  accent: '#1f6f8b',
  onAccent: '#ffffff',
} as const;

export type ColorRole = keyof typeof lightColors;
export type ThemeColors = Record<ColorRole, string>;

// ...and the dark set must fill every one of them. Run npm run typecheck: one role is missing (the light teal of
// the night accent needs DARK text on it). Then npm test: one night color fails the 4.5:1 contrast rule.
export const darkColors = {
  page: '#0f1b26',
  surface: '#16283a',
  text: '#e9eef3',
  textMuted: '#5b6573',
  accent: '#7cc6d6',
} satisfies ThemeColors;
