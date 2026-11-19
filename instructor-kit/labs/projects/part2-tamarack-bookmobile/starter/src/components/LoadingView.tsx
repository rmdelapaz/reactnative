import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/spacing';

// The phone's own spinner with words under it, for the first load of a screen
export function LoadingView({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.box}>
      <ActivityIndicator size="large" color={colors.action} aria-hidden />
      <AppText variant="muted">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
});
