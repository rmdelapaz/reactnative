import { StyleSheet, Text, type TextProps } from 'react-native';

import { createThemedStyles } from '@/hooks/useTheme';

// Every piece of text in Bookmobile Stops goes through AppText: one set of text styles
export type TextVariant = 'title' | 'heading' | 'body' | 'muted' | 'error';

type AppTextProps = TextProps & {
  variant?: TextVariant;
};

export function AppText({ variant = 'body', style, ...rest }: AppTextProps) {
  const styles = useStyles();
  return <Text style={[styles.base, styles[variant], style]} {...rest} />;
}

const useStyles = createThemedStyles(({ colors }) =>
  StyleSheet.create({
    base: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    title: {
      color: colors.heading,
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700',
    },
    heading: {
      color: colors.heading,
      fontSize: 19,
      lineHeight: 26,
      fontWeight: '700',
    },
    body: {},
    muted: {
      color: colors.textMuted,
    },
    error: {
      color: colors.error,
    },
  }),
);
