import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { spacing } from '@/theme/spacing';

export type Choice<T extends string> = {
  value: T;
  label: string;
};

type ChoiceGroupProps<T extends string> = {
  label: string;
  choices: Choice<T>[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
};

// One of a few choices, as buttons: the chosen one is filled in. A screen reader hears a group of
// radio buttons ("Pine Hollow Elementary, radio button, selected").
export function ChoiceGroup<T extends string>({ label, choices, value, onChange, error }: ChoiceGroupProps<T>) {
  return (
    <View style={styles.group}>
      <AppText style={styles.label}>{label}</AppText>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.row}>
        {choices.map((choice) => (
          <Button
            key={choice.value}
            label={choice.label}
            variant={choice.value === value ? 'primary' : 'secondary'}
            accessibilityRole="radio"
            aria-checked={choice.value === value}
            onPress={() => onChange(choice.value)}
          />
        ))}
      </View>
      {error !== undefined && (
        <AppText variant="error" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.xs,
  },
  label: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
