import type { ColorSchemeName } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from '@/theme/colors';

// Everything a screen needs to draw itself in one color scheme
export type Theme = {
  scheme: ColorSchemeName; // 'light' or 'dark'
  colors: ThemeColors;
};

export const themes: Record<ColorSchemeName, Theme> = {
  light: { scheme: 'light', colors: lightColors },
  dark: { scheme: 'dark', colors: darkColors },
};
