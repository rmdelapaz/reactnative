import { Pressable, StyleSheet, Switch } from 'react-native';

import { AppText } from '@/components/AppText';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/spacing';

type SwitchRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

// An on/off choice: the words on the left, the phone's own switch on the right. The whole row is
// the touch target; a screen reader meets one control, the switch, which says the words itself.
export function SwitchRow({ label, value, onValueChange }: SwitchRowProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessible={false} // not a stop of its own for screen readers: the switch is
      tabIndex={-1} // nor for a keyboard (Android, the web preview): Tab goes to the switch
      style={styles.row}
    >
      {/* Seen, not read: the switch's accessibilityLabel says the same words */}
      <AppText style={styles.label} aria-hidden>
        {label}
      </AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label} // a screen reader says the words with the switch
        // A finger anywhere on the row presses the row (above), so the switch never gets
        // the same touch twice. Screen readers and keyboards still reach the switch itself.
        style={styles.switch}
        // Gray when off, Sea Teal when on. iOS paints the off track with ios_backgroundColor
        // (Android and the web ignore that prop).
        trackColor={{ false: colors.trackOff, true: colors.action }}
        ios_backgroundColor={colors.trackOff}
        thumbColor={colors.knob} // a white knob on every platform, by day and by night
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
  },
  label: {
    flex: 1, // long words wrap instead of pushing the switch off the screen
  },
  switch: {
    pointerEvents: 'none', // touches go through to the row
  },
});
