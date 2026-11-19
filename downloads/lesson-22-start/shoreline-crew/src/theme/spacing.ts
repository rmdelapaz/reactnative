// Sizes in density-independent pixels: plain numbers, no units
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export const radius = {
  card: 12,
  picture: 8,
  control: 8, // buttons and text fields
} as const;

// Window widths where the layout changes, in the same density-independent pixels
export const layout = {
  twoColumns: 700, // from here up (tablets, a phone on its side, a wide browser): 2 columns
  maxContentWidth: 960, // on even wider screens, content stays this wide, in the middle
} as const;
