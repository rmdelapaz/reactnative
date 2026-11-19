import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Icon, type IconName } from '@/components/Icon';
import { useLargeText } from '@/hooks/useLargeText';
import { spacing } from '@/theme/spacing';

type DetailProps = {
  icon: IconName;
  label: string;
  children: ReactNode;
};

// An icon, a label and its value side by side: the label keeps its width, the value takes the rest.
// With large text, the value moves under the label and gets the whole width.
// Used by the cleanup cards and by the cleanup's own screen.
export function Detail({ icon, label, children }: DetailProps) {
  const largeText = useLargeText();
  return (
    <View style={[styles.detail, largeText && styles.wrap]}>
      <View style={styles.icon}>
        <Icon name={icon} />
      </View>
      <AppText variant="muted" style={largeText ? styles.labelLarge : styles.label}>
        {label}
      </AppText>
      <AppText style={largeText ? styles.valueLarge : styles.value}>{children}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  icon: {
    height: 24, // one line of text: the icon centers on the first line of the value
    justifyContent: 'center',
  },
  label: {
    width: 72,
  },
  value: {
    flex: 1, // take the space the label leaves, and wrap inside it
  },
  wrap: {
    flexWrap: 'wrap',
  },
  labelLarge: {
    flex: 1, // the rest of the first line, beside the icon
  },
  valueLarge: {
    width: '100%', // a line of its own, under the icon and the label
  },
});
