import { Pressable, StyleSheet, Switch } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { AppText } from './AppText';

type SwitchRowProps = { label: string; value: boolean; onValueChange: (value: boolean) => void };

// An on/off choice (the course's SwitchRow): the words on the left, the phone's own switch on the right. The whole
// row is the touch target; a screen reader meets one control, the switch, which says the words itself.
export function SwitchRow({ label, value, onValueChange }: SwitchRowProps) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={() => onValueChange(!value)} accessible={false} tabIndex={-1} style={styles.row}>
      {/* Seen, not read: the switch's accessibilityLabel says the same words */}
      <AppText style={styles.label} aria-hidden>
        {label}
      </AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        style={styles.switch}
        trackColor={{ false: colors.trackOff, true: colors.action }}
        ios_backgroundColor={colors.trackOff}
        thumbColor={colors.knob}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 48 },
  label: { flex: 1 },
  switch: { pointerEvents: 'none' }, // touches go through to the row, so the switch never gets one twice
});
