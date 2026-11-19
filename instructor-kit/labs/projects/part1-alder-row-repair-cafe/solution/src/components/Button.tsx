import { Pressable, StyleSheet } from 'react-native';

import { createThemedStyles } from '../hooks/useTheme';
import { radius, spacing } from '../theme/spacing';
import { AppText } from './AppText';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  // What a screen reader says when the label alone is not enough ("Mark Toaster fixed")
  accessibilityLabel?: string;
};

// A button with a pressed look, at least 48 high (a finger's size)
export function Button({ label, onPress, variant = 'secondary', accessibilityLabel }: ButtonProps) {
  const styles = useStyles();
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.button, primary && styles.primary, pressed && (primary ? styles.primaryPressed : styles.pressed)]}>
      <AppText style={[styles.label, primary && styles.primaryLabel]}>{label}</AppText>
    </Pressable>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.action,
    borderRadius: radius.control,
  },
  pressed: { backgroundColor: colors.pressed },
  primary: { backgroundColor: colors.action },
  primaryPressed: { backgroundColor: colors.actionPressed },
  label: { color: colors.action, fontWeight: '600' },
  primaryLabel: { color: colors.onAction },
}));
