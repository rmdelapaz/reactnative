import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { createThemedStyles, useTheme } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  // What a screen reader calls the field: the placeholder is gone as soon as you type
  label: string;
  placeholder?: string;
};

// A search box: a magnifying glass, the text field, and a clear button once there is text
export function SearchField({ value, onChangeText, label, placeholder }: SearchFieldProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.field}>
      <Icon name="search" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel={label}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        enterKeyHint="search" // the keyboard's return key says "search"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      {value !== '' && (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Clear search" // an icon-only button needs words for screen readers
          hitSlop={8} // 32 plus 8 on every side: a 48 by 48 target for a finger
          style={({ pressed }) => [styles.clear, pressed && styles.clearPressed]}
        >
          <Icon name="clear" color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1, // the field takes the space the icons leave
    alignSelf: 'stretch', // and the row's full height: a tap anywhere on the row lands in it
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: 16,
  },
  clear: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  clearPressed: {
    backgroundColor: colors.pressed,
  },
}));
