import type { ColorSchemeName } from 'react-native';

import {
  type BadgeColors,
  type BadgeTone,
  darkBadges,
  darkColors,
  lightBadges,
  lightColors,
  type ThemeColors,
} from '@/theme/colors';

// Everything a screen needs to draw itself in one color scheme
export type Theme = {
  scheme: ColorSchemeName; // 'light' or 'dark'
  colors: ThemeColors;
  badges: Record<BadgeTone, BadgeColors>;
};

export const themes: Record<ColorSchemeName, Theme> = {
  light: { scheme: 'light', colors: lightColors, badges: lightBadges },
  dark: { scheme: 'dark', colors: darkColors, badges: darkBadges },
};
