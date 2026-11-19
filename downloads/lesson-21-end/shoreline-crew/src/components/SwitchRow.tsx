import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/spacing';

type SwitchRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

// An on/off choice: the words on the left, the phone's own switch on the right
export function SwitchRow({ label, value, onValueChange }: SwitchRowProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <AppText style={styles.label}>{label}</AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label} // a screen reader says the words with the switch
        // Gray when off, Sea Teal when on. iOS paints the off track with ios_backgroundColor
        // (Android and the web ignore that prop).
        trackColor={{ false: colors.trackOff, true: colors.action }}
        ios_backgroundColor={colors.trackOff}
        thumbColor={colors.knob} // a white knob on every platform, by day and by night
      />
    </View>
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
});
