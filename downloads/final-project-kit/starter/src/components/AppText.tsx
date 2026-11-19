import { type ReactNode, useEffect } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { createThemedStyles } from '@/hooks/useTheme';

// Every piece of text goes through AppText, so the app has one set of text styles (Lesson 2.1)
export type TextVariant = 'title' | 'heading' | 'body' | 'muted' | 'error';

type AppTextProps = TextProps & {
  variant?: TextVariant;
};

// The words of a text made of strings and numbers (what a screen reader would say)
function wordsOf(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  return Array.isArray(children) ? children.map(wordsOf).join('') : '';
}

export function AppText({ variant = 'body', style, ...rest }: AppTextProps) {
  const styles = useStyles();
  const live = rest.accessibilityLiveRegion !== undefined && rest.accessibilityLiveRegion !== 'none';
  const words = live ? wordsOf(rest.children) : '';
  useEffect(() => {
    // iPhone has no live regions (accessibilityLiveRegion is for Android and the web): VoiceOver
    // says the new words because we ask it to, queued behind whatever it is saying already
    if (Platform.OS === 'ios' && words !== '') {
      AccessibilityInfo.announceForAccessibilityWithOptions(words, { queue: true });
    }
  }, [words]);
  // Later styles win: the base, then the variant, then whatever the screen passes in
  return (
    <Text
      // Titles are big already: they grow with the phone's text size, but at most 1.75 times
      maxFontSizeMultiplier={variant === 'title' ? 1.75 : undefined}
      style={[styles.base, styles[variant], style]}
      {...rest}
    />
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  base: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  // The phone's own font everywhere. A brand font: Lesson 2.3 (expo-font + a typography.ts)
  title: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  heading: {
    fontWeight: '600',
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
}));
