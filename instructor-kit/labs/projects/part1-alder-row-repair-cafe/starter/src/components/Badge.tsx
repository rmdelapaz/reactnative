import { StyleSheet, View } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { type BadgeTone, badgeColors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppText } from './AppText';

// A small sticker with a word on it: "In repair", "Fixed"
export function Badge({ label, tone }: { label: string; tone: BadgeTone }) {
  const { scheme } = useTheme();
  const c = badgeColors[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.background, borderColor: c.border }]}>
      <AppText style={[styles.label, { color: scheme === 'dark' ? c.darkText : c.text }]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '600' },
});
