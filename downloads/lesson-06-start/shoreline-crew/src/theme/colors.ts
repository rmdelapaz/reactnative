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

// What the screens use: a job, not a color name. Lesson 2.5 adds a dark set with the same names.
export const colors = {
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
} as const;
