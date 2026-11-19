// Sizes in density-independent pixels: plain numbers, no units
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export const radius = {
  card: 12,
  control: 8,
} as const;

export const layout = {
  twoColumns: 700, // from here up: two columns of cards
  maxContentWidth: 960,
} as const;
