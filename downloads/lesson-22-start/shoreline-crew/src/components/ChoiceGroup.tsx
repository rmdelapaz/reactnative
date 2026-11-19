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
};

// One of a few choices, as a row of buttons: the chosen one is filled in. A screen reader hears
// a group of radio buttons ("Light, radio button, selected").
export function ChoiceGroup<T extends string>({
  label,
  choices,
  value,
  onChange,
}: ChoiceGroupProps<T>) {
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
    flexWrap: 'wrap', // with large text, the buttons wrap instead of running off the screen
    gap: spacing.sm,
  },
});
