import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { brand, colors } from '@/theme/colors';

export type BadgeTone = 'info' | 'success' | 'neutral' | 'danger' | 'attention';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

// A small rounded label. The View is the pill, the text inside it is the word.
export function Badge({ label, tone = 'info' }: BadgeProps) {
  return (
    <View style={[styles.badge, boxes[tone]]}>
      <AppText style={[styles.label, labels[tone]]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});

// One box style and one text style per BadgeTone, like the HQ's Badge.module.css
const boxes = StyleSheet.create({
  info: { backgroundColor: brand.seafoam },
  success: { backgroundColor: brand.kelp },
  neutral: { borderWidth: 1, borderColor: colors.textMuted },
  danger: { backgroundColor: brand.coral },
  attention: { backgroundColor: brand.sunrise },
});

const labels = StyleSheet.create({
  info: { color: brand.ink },
  success: { color: brand.white },
  neutral: { color: colors.text },
  danger: { color: brand.white },
  attention: { color: brand.ink },
});
