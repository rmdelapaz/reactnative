import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type SwitchRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

// An on/off choice: the words on the left, the phone's own switch on the right
export function SwitchRow({ label, value, onValueChange }: SwitchRowProps) {
  return (
    <View style={styles.row}>
      <AppText style={styles.label}>{label}</AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label} // a screen reader says the words with the switch
        trackColor={{ true: colors.action }} // Sea Teal when on; each platform's own gray when off
        thumbColor={colors.surface} // a white knob on every platform
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
