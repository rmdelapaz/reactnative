import { Pressable, type PressableProps, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';

export type ButtonVariant = 'primary' | 'secondary';

// All of Pressable's props (onPress, disabled, accessibilityLabel, ...) except the two Button sets itself
type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
};

// Shoreline Crew's one button: words in a box at least 48 tall that answers a finger at once
export function Button({ label, variant = 'secondary', disabled, ...rest }: ButtonProps) {
  const { boxes, pressedBoxes, labels } = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      {...rest}
      // A function: React Native calls it again with pressed: true while a finger is down
      style={({ pressed }) => [
        styles.base,
        boxes[variant],
        pressed && pressedBoxes[variant],
        disabled && styles.disabled,
      ]}
    >
      <AppText style={[styles.label, labels[variant]]}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start', // as wide as its words, not stretched across a column
    maxWidth: '100%', // ...but never wider than the space it is in: long words wrap inside
    minWidth: 48, // a finger-sized target, even for a one-character label
    justifyContent: 'center',
    minHeight: 48, // a finger-sized target, even with small text
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.control,
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

// The colors, once for each theme: three small style sheets keyed by variant
const useStyles = createThemedStyles(({ colors }) => ({
  boxes: StyleSheet.create({
    primary: { backgroundColor: colors.action, borderColor: colors.action },
    secondary: { backgroundColor: colors.surface, borderColor: colors.action },
  }),
  pressedBoxes: StyleSheet.create({
    primary: { backgroundColor: colors.actionPressed, borderColor: colors.actionPressed },
    secondary: { backgroundColor: colors.pressed },
  }),
  labels: StyleSheet.create({
    primary: { color: colors.onAction },
    secondary: { color: colors.action },
  }),
}));
