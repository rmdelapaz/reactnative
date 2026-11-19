import { useColorScheme } from '@/hooks/useColorScheme';
import { type Theme, themes } from '@/theme/theme';

// The theme for the phone's current setting: light, or dark when the phone is in dark mode
export function useTheme(): Theme {
  const scheme = useColorScheme();
  return themes[scheme === 'dark' ? 'dark' : 'light'];
}

// Styles that use theme colors: made once for each theme, then picked by the current one.
// Call it outside a component; it returns a hook to call inside one.
export function createThemedStyles<T>(make: (theme: Theme) => T) {
  const sheets = { light: make(themes.light), dark: make(themes.dark) };
  return function useStyles(): T {
    return sheets[useTheme().scheme];
  };
}
