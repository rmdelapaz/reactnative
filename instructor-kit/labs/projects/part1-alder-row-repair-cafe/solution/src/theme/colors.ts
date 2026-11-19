// Alder Row Repair Café's colors, by job (Lesson 2.5): the light set decides which jobs exist...
export const lightColors = {
  page: '#f7f3ea', // oat
  surface: '#ffffff',
  border: '#ddd3c0',
  text: '#26221c',
  textMuted: '#5e564a',
  heading: '#7a3b12', // rust
  banner: '#2f4a3a', // workshop green
  onBanner: '#ffffff',
  onBannerAccent: '#f3d9a4',
  action: '#2f6b4f',
  actionPressed: '#1f4a36',
  onAction: '#ffffff',
  pressed: '#e3efe7',
  inputBorder: '#6b6256',
  knob: '#ffffff',
  trackOff: '#6b6256',
} as const;

export type ColorRole = keyof typeof lightColors;
export type ThemeColors = Record<ColorRole, string>;

// ...and the dark set must fill every one of them
export const darkColors = {
  page: '#16140f',
  surface: '#221f18',
  border: '#3d382d',
  text: '#f1ece2',
  textMuted: '#c2b9a8',
  heading: '#f0b27a',
  banner: '#2f4a3a',
  onBanner: '#ffffff',
  onBannerAccent: '#f3d9a4',
  action: '#8fd1ad',
  actionPressed: '#c4ead5',
  onAction: '#16140f',
  pressed: '#2e3a31',
  inputBorder: '#a39a8a',
  knob: '#ffffff',
  trackOff: '#7a7264',
} satisfies ThemeColors;

// The small status stickers: the same by day and by night
export type BadgeTone = 'neutral' | 'info' | 'success' | 'danger';
export const badgeColors = {
  neutral: { background: 'transparent', text: '#5e564a', darkText: '#c2b9a8', border: '#8a8170' },
  info: { background: '#d8e9f5', text: '#1d3a52', darkText: '#1d3a52', border: '#d8e9f5' },
  success: { background: '#2f6b4f', text: '#ffffff', darkText: '#ffffff', border: '#2f6b4f' },
  danger: { background: '#a33a1f', text: '#ffffff', darkText: '#ffffff', border: '#a33a1f' },
} satisfies Record<BadgeTone, { background: string; text: string; darkText: string; border: string }>;
