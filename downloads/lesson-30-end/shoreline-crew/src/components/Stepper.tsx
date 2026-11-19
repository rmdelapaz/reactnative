import type { Ref } from 'react';
import { StyleSheet, TextInput, type TextInputInstance, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { createThemedStyles, useTheme } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';

type StepperProps = {
  label: string;
  // The count as text, like any text field: what the volunteer typed, or what the buttons made
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  max: number;
  error?: string;
  ref?: Ref<TextInputInstance>;
};

// A count you change with a thumb: minus, the number, plus. The number is a text field too,
// for counts too big to tap up to (230 cigarette butts).
export function Stepper({ label, value, onChange, onBlur, max, error, ref }: StepperProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  // Whatever is in the box, as a number to step from (0 when it is not a whole number yet)
  const count = /^\d+$/.test(value.trim()) ? Number(value.trim()) : 0;

  return (
    <View style={styles.stepper}>
      <View style={styles.row}>
        <AppText style={styles.label}>{label}</AppText>
        <Button
          label="−"
          accessibilityLabel={`Fewer: ${label}`}
          disabled={count === 0}
          onPress={() => onChange(String(count - 1))}
        />
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          accessibilityLabel={label}
          inputMode="numeric" // digits only: the number pad
          selectTextOnFocus // typing replaces the 0 instead of adding to it
          maxLength={6}
          style={[styles.input, error !== undefined && styles.invalid]}
          placeholderTextColor={colors.textMuted}
        />
        <Button
          label="+"
          accessibilityLabel={`More: ${label}`}
          disabled={count >= max}
          onPress={() => onChange(String(count + 1))}
        />
      </View>
      {error !== undefined && (
        <AppText variant="error" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      )}
    </View>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  stepper: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    flex: 1, // the words take what is left, and wrap if they must
  },
  input: {
    width: 72,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
  invalid: {
    borderColor: colors.error,
    borderWidth: 2,
  },
}));
