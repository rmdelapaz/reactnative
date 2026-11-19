import { useColorScheme } from '@/hooks/useColorScheme';
import { useSettings } from '@/state/settings';
import { type Theme, themes } from '@/theme/theme';

// The theme the volunteer chose on Profile: light, dark, or the phone's own setting
export function useTheme(): Theme {
  const phoneScheme = useColorScheme();
  const { theme } = useSettings();
  const scheme = theme === 'system' ? phoneScheme : theme;
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
