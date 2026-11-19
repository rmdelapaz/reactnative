import { Pressable, type PressableProps, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export type ButtonVariant = 'primary' | 'secondary';

// All of Pressable's props (onPress, disabled, accessibilityLabel, ...) except the two Button sets itself
type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
};

// Shoreline Crew's one button: words in a box at least 48 tall that answers a finger at once
export function Button({ label, variant = 'secondary', disabled, ...rest }: ButtonProps) {
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

const boxes = StyleSheet.create({
  primary: { backgroundColor: colors.action, borderColor: colors.action },
  secondary: { backgroundColor: colors.surface, borderColor: colors.action },
});

const pressedBoxes = StyleSheet.create({
  primary: { backgroundColor: colors.actionPressed, borderColor: colors.actionPressed },
  secondary: { backgroundColor: colors.pressed },
});

const labels = StyleSheet.create({
  primary: { color: colors.onAction },
  secondary: { color: colors.action },
});
