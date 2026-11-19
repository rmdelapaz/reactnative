import { StyleSheet, Text, type TextProps } from 'react-native';

import { createThemedStyles } from '../hooks/useTheme';

type AppTextProps = TextProps & { variant?: 'body' | 'muted' | 'heading' | 'title' };

// All text in the app: the theme's colors, the phone's text size setting respected
export function AppText({ variant = 'body', style, ...rest }: AppTextProps) {
  const styles = useStyles();
  return <Text style={[styles.base, styles[variant], style]} {...rest} />;
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  base: { color: colors.text, fontSize: 16, lineHeight: 22 },
  body: {},
  muted: { color: colors.textMuted },
  heading: { color: colors.heading, fontSize: 20, lineHeight: 26, fontWeight: '700' },
  title: { color: colors.onBanner, fontSize: 28, lineHeight: 34, fontWeight: '700' },
}));
