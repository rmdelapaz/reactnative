import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from '../theme/colors';

export type Theme = { scheme: 'light' | 'dark'; colors: ThemeColors };
const themes: Record<Theme['scheme'], Theme> = {
  light: { scheme: 'light', colors: lightColors },
  dark: { scheme: 'dark', colors: darkColors },
};

// The theme for the phone's setting: light, or dark when the phone is in dark mode
export function useTheme(): Theme {
  return themes[useColorScheme() === 'dark' ? 'dark' : 'light'];
}

// Styles that use theme colors: made once per theme, picked by the current one (Lesson 2.5).
// Call it outside a component; it returns a hook to call inside one.
export function createThemedStyles<T>(make: (theme: Theme) => T) {
  const sheets = { light: make(themes.light), dark: make(themes.dark) };
  return function useStyles(): T {
    return sheets[useTheme().scheme];
  };
}
