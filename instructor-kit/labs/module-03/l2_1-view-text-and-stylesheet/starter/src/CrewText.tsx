import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors } from './theme';

// Task 2: the lab's text component (the course app's AppText idea), with two mistakes in it.
// A screen must be able to change anything a variant sets, and every variant needs a style.
export type CrewVariant = 'label' | 'body' | 'warning';

type CrewTextProps = TextProps & {
  variant?: CrewVariant;
};

export function CrewText({ variant = 'body', style, ...rest }: CrewTextProps) {
  return <Text style={[style, styles.base, styles[variant]]} {...rest} />;
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
});
