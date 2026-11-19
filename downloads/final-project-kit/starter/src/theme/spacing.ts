// Sizes in density-independent pixels: plain numbers, no units
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export const radius = {
  card: 12,
  control: 8, // buttons and text fields
} as const;

// On a tablet or a wide browser, content stops growing at this width and sits in the middle
export const layout = {
  maxContentWidth: 960,
} as const;
