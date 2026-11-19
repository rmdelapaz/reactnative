import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

// Every piece of text in Shoreline Crew goes through AppText, so the app has one set of text styles
export type TextVariant = 'title' | 'heading' | 'body' | 'muted' | 'error';

type AppTextProps = TextProps & {
  variant?: TextVariant;
};

export function AppText({ variant = 'body', style, ...rest }: AppTextProps) {
  // Later styles win: the base, then the variant, then whatever the screen passes in
  return <Text style={[styles.base, styles[variant], style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: 32,
    lineHeight: 40,
  },
  heading: {
    fontFamily: fonts.heading,
    color: colors.heading,
    fontSize: 20,
    lineHeight: 28,
  },
  body: {},
  muted: {
    color: colors.textMuted,
  },
  error: {
    color: colors.error,
  },
});
