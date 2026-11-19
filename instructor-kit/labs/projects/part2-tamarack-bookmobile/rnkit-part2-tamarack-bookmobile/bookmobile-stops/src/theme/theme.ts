import { darkColors, lightColors, type ThemeColors } from '@/theme/colors';

// Everything a screen needs to draw itself in one color scheme
export type Theme = {
  scheme: 'light' | 'dark';
  colors: ThemeColors;
};

export const themes: Record<'light' | 'dark', Theme> = {
  light: { scheme: 'light', colors: lightColors },
  dark: { scheme: 'dark', colors: darkColors },
};
