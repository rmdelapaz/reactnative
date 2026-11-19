import { Pressable, type PressableProps, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';

export type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
};

// The app's one button: words in a box at least 48 tall
export function Button({ label, variant = 'secondary', disabled, ...rest }: ButtonProps) {
  const { boxes, pressedBoxes, labels } = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      {...rest}
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
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: 48,
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
