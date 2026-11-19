import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { type BadgeTone, badges } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type BadgeProps = {
  label: string;
  tone: BadgeTone;
};

// A small sticker: "My stop", "Ready at the stop", "On the van"
export function Badge({ label, tone }: BadgeProps) {
  const { background, text } = badges[tone];
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <AppText style={[styles.label, { color: text }]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});
