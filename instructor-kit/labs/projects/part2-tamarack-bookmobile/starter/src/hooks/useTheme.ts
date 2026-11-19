import { useColorScheme } from '@/hooks/useColorScheme';
import { type Theme, themes } from '@/theme/theme';

// The phone's own light or dark setting
export function useTheme(): Theme {
  return themes[useColorScheme() === 'dark' ? 'dark' : 'light'];
}

// Styles that use theme colors: made once for each theme, then picked by the current one.
// Call it outside a component; it returns a hook to call inside one.
export function createThemedStyles<T>(make: (theme: Theme) => T) {
  const sheets = { light: make(themes.light), dark: make(themes.dark) };
  return function useStyles(): T {
    return sheets[useTheme().scheme];
  };
}
