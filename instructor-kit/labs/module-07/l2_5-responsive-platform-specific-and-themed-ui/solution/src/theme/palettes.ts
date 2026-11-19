// The day and night palettes of the beach-tiles screen. The light set decides which roles exist...
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

// ...and the dark set must fill every one of them (satisfies: a missing role is a type error). Night colors are
// lighter, softer versions, checked against the same 4.5:1 rule; on the light night accent, the text turns dark.
export const darkColors = {
  page: '#0f1b26',
  surface: '#16283a',
  text: '#e9eef3',
  textMuted: '#a9b4c0',
  accent: '#7cc6d6',
  onAccent: '#0f1b26',
} satisfies ThemeColors;
