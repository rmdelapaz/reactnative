// The app's colors, named by their job, not by how they look (Lesson 2.5). These are a neutral
// starting point: replace the values with your brief's brand (worksheet section 3) and check
// every pair that sits on top of each other (text on page, text on surface, onAction on action).
export const lightColors = {
  page: '#f6f7f9',
  surface: '#ffffff',
  border: '#d5dae1',
  text: '#1f2933',
  textMuted: '#52606d',
  heading: '#243b53',
  error: '#b42318',
  action: '#2f5d8a', // buttons and links: things you press
  actionPressed: '#1f3f5f', // a filled button while a finger is on it
  onAction: '#ffffff', // text on a filled button
  pressed: '#dbe7f3', // behind an outlined button or a row while pressed
  inputBorder: '#52606d', // the edge of a text field (3:1 or more against white)
} as const;

export type ColorRole = keyof typeof lightColors;
export type ThemeColors = Record<ColorRole, string>;

// The dark set must fill every role the light set has: a missing one is a type error
export const darkColors = {
  page: '#111827',
  surface: '#1f2937',
  border: '#374151',
  text: '#f3f4f6',
  textMuted: '#aeb6c2',
  heading: '#c7d7ee',
  error: '#ff9b8c',
  action: '#8fb8e8',
  actionPressed: '#c7d7ee',
  onAction: '#111827', // dark text on the light blue
  pressed: '#2d3a4d',
  inputBorder: '#aeb6c2',
} satisfies ThemeColors;
