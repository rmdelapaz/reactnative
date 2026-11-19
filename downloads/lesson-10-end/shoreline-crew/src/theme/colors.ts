// Shoreline Crew's colors: the same brand as Shoreline Crew HQ's index.css, as plain values.
export const brand = {
  deepTide: '#0b3954',
  seaTeal: '#1f6f8b',
  sunrise: '#f4a259',
  sand: '#fbf6ec',
  seafoam: '#bfe3df',
  kelp: '#2d6a4f',
  coral: '#b23a22',
  ink: '#1f2a37',
  muted: '#5b6573',
  white: '#ffffff',
} as const;

// The same brand after dark (the HQ's dark values): a deep blue-black page, lighter text
export const night = {
  page: '#0f1b26',
  surface: '#16283a',
  border: '#2b4257',
  raised: '#21405a', // a pressed button, the frame behind a loading picture
  ink: '#e9eef3',
  muted: '#a9b4c0',
  slate: '#6b7684', // a switch's track when off
  seaTeal: '#7cc6d6',
  coral: '#ff9b85',
} as const;

// What the screens use: a job, not a color name. The light set decides which jobs exist...
export const lightColors = {
  page: brand.sand,
  surface: brand.white,
  border: '#e4dccb',
  text: brand.ink,
  textMuted: brand.muted,
  heading: brand.deepTide,
  error: brand.coral,
  banner: brand.deepTide,
  onBanner: brand.white,
  onBannerAccent: brand.seafoam,
  icon: brand.seaTeal,
  picture: brand.seafoam, // behind a picture while it loads
  action: brand.seaTeal, // buttons, switches: things you press
  actionPressed: brand.deepTide, // a filled button while a finger is on it
  onAction: brand.white, // text on a filled button
  pressed: '#d4ebe8', // behind an outlined button while pressed (paler than Seafoam: 4.5:1)
  inputBorder: brand.muted, // the edge of a text field (3:1 or more against white)
  knob: brand.white, // a switch's knob, on and off
  trackOff: brand.muted, // a switch's track when off
} as const;

export type ColorRole = keyof typeof lightColors;
export type ThemeColors = Record<ColorRole, string>;

// ...and the dark set must fill every one of them: a missing or misspelled role is a type error
export const darkColors = {
  page: night.page,
  surface: night.surface,
  border: night.border,
  text: night.ink,
  textMuted: night.muted,
  heading: brand.seafoam,
  error: night.coral,
  banner: brand.deepTide,
  onBanner: brand.white,
  onBannerAccent: brand.seafoam,
  icon: night.seaTeal,
  picture: night.raised,
  action: night.seaTeal,
  actionPressed: brand.seafoam,
  onAction: night.page, // dark text on the light Sea Teal
  pressed: night.raised,
  inputBorder: night.muted,
  knob: brand.white,
  trackOff: night.slate,
} satisfies ThemeColors;

// A badge is a small sticker with its own background: most tones read the same by day and night
export type BadgeColors = { background: string; text: string; border: string };
export type BadgeTone = 'info' | 'success' | 'neutral' | 'danger' | 'attention';

export const lightBadges = {
  info: { background: brand.seafoam, text: brand.ink, border: brand.seafoam },
  success: { background: brand.kelp, text: brand.white, border: brand.kelp },
  neutral: { background: 'transparent', text: lightColors.text, border: lightColors.textMuted },
  danger: { background: brand.coral, text: brand.white, border: brand.coral },
  attention: { background: brand.sunrise, text: brand.ink, border: brand.sunrise },
} satisfies Record<BadgeTone, BadgeColors>;

export const darkBadges = {
  info: { background: brand.seafoam, text: brand.ink, border: brand.seafoam },
  success: { background: brand.kelp, text: brand.white, border: brand.kelp },
  neutral: { background: 'transparent', text: darkColors.text, border: darkColors.textMuted },
  danger: { background: brand.coral, text: brand.white, border: brand.coral },
  attention: { background: brand.sunrise, text: brand.ink, border: brand.sunrise },
} satisfies Record<BadgeTone, BadgeColors>;
