import { StyleSheet, TextInput } from 'react-native';

import { createThemedStyles, useTheme } from '../hooks/useTheme';
import { radius, spacing } from '../theme/spacing';

type SearchFieldProps = { value: string; onChangeText: (text: string) => void; label: string; placeholder?: string };

// A search box (Lesson 2.4): the label is what a screen reader says, the placeholder disappears as you type
export function SearchField({ value, onChangeText, label, placeholder }: SearchFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      accessibilityLabel={label}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      enterKeyHint="search"
      autoCapitalize="none"
      autoCorrect={false}
      style={styles.input}
    />
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
}));
