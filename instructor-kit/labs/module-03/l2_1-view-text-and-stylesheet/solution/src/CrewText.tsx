import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors } from './theme';

// A style array merges left to right and later entries win: the base, then the variant, then the screen's style
export type CrewVariant = 'label' | 'body' | 'warning';

type CrewTextProps = TextProps & {
  variant?: CrewVariant;
};

export function CrewText({ variant = 'body', style, ...rest }: CrewTextProps) {
  return <Text style={[styles.base, styles[variant], style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {},
  warning: {
    color: colors.warning,
    fontWeight: 'bold',
  },
});
