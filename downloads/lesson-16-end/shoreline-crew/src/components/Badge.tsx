import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useTheme } from '@/hooks/useTheme';
import type { BadgeTone } from '@/theme/colors';

export type { BadgeTone };

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

// A small rounded label. The View is the pill, the text inside it is the word.
export function Badge({ label, tone = 'info' }: BadgeProps) {
  // The tone's three colors for the current theme (the HQ's Badge.module.css, by day and by night)
  const { background, text, border } = useTheme().badges[tone];
  return (
    <View style={[styles.badge, { backgroundColor: background, borderColor: border }]}>
      <AppText style={[styles.label, { color: text }]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 1, // every tone has a border now, so all badges are the same height
    borderRadius: 999,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});
