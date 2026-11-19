// Bookmobile Stops' colors: Tamarack green (the van's paint), library amber and paper, as jobs.
export const brand = {
  tamarack: '#1f5f3f',
  pine: '#143d29',
  amber: '#e2a33b',
  paper: '#f7f4ec',
  moss: '#cfe6d6',
  brick: '#a8321e',
  ink: '#1d2420',
  muted: '#55605a',
  white: '#ffffff',
} as const;

const night = {
  page: '#111a15',
  surface: '#18261e',
  border: '#2c4235',
  raised: '#24392c',
  ink: '#e8efe9',
  muted: '#a8b5ad',
  leaf: '#8fd3a8',
  brick: '#ff9b85',
} as const;

// What the screens use: a job, not a color name. The light set decides which jobs exist...
export const lightColors = {
  page: brand.paper,
  surface: brand.white,
  border: '#dcd6c6',
  text: brand.ink,
  textMuted: brand.muted,
  heading: brand.pine,
  error: brand.brick,
  icon: brand.tamarack,
  action: brand.tamarack,
  actionPressed: brand.pine,
  onAction: brand.white,
  pressed: '#e3efe6',
  inputBorder: brand.muted,
} as const;

export type ColorRole = keyof typeof lightColors;
export type ThemeColors = Record<ColorRole, string>;

// ...and the dark set must fill every one of them
export const darkColors = {
  page: night.page,
  surface: night.surface,
  border: night.border,
  text: night.ink,
  textMuted: night.muted,
  heading: brand.moss,
  error: night.brick,
  icon: night.leaf,
  action: night.leaf,
  actionPressed: brand.moss,
  onAction: night.page,
  pressed: night.raised,
  inputBorder: night.muted,
} satisfies ThemeColors;

// A badge: a small sticker with its own background, the same by day and night
export type BadgeColors = { background: string; text: string };
export type BadgeTone = 'success' | 'attention' | 'info' | 'danger';

export const badges = {
  success: { background: brand.tamarack, text: brand.white },
  attention: { background: brand.amber, text: brand.ink },
  info: { background: brand.moss, text: brand.ink },
  danger: { background: brand.brick, text: brand.white },
} satisfies Record<BadgeTone, BadgeColors>;
