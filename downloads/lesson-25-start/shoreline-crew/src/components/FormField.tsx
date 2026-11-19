import type { Ref } from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputInstance,
  type TextInputProps,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { createThemedStyles, useTheme } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';

// All of TextInput's props (keyboardType, autoComplete, secureTextEntry, ...) plus a label and an error
type FormFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string;
  // The text field itself, for whoever needs to move the focus to it (React 19: ref is a prop)
  ref?: Ref<TextInputInstance>;
};

// A labeled text field, with the reason it needs fixing underneath when there is one
export function FormField({ label, error, ref, ...input }: FormFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.field}>
      {/* The label is for eyes; accessibilityLabel says the same to a screen reader */}
      <AppText style={styles.label}>{label}</AppText>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        {...input}
        style={[styles.input, error !== undefined && styles.invalid]}
      />
      {error !== undefined && (
        <AppText variant="error" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      )}
    </View>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    minHeight: 48, // a finger-sized target
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  invalid: {
    borderColor: colors.error,
    borderWidth: 2,
  },
}));
