import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from './palettes';

export type Scheme = 'light' | 'dark';
export type Theme = { scheme: Scheme; colors: ThemeColors };

export const themes: Record<Scheme, Theme> = {
  light: { scheme: 'light', colors: lightColors },
  dark: { scheme: 'dark', colors: darkColors },
};

// The theme for the phone's current setting (null, unknown, counts as light): Shoreline Crew's useTheme
export function useTheme(): Theme {
  const scheme = useColorScheme();
  return themes[scheme === 'dark' ? 'dark' : 'light'];
}

// Styles with theme colors: made once per theme when the file loads, picked inside a component by the hook it
// returns (Shoreline Crew's createThemedStyles)
export function createThemedStyles<T>(make: (theme: Theme) => T) {
  const sheets = { light: make(themes.light), dark: make(themes.dark) };
  return function useStyles(): T {
    return sheets[useTheme().scheme];
  };
}
