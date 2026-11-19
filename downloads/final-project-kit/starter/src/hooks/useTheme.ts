import { useColorScheme } from '@/hooks/useColorScheme';
import { type Theme, themes } from '@/theme/theme';

// The theme that matches the phone's light or dark setting (Lesson 2.5). If your app lets people
// choose, read their choice here (Lesson 5.3's settings): this hook stays the one place that decides.
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
