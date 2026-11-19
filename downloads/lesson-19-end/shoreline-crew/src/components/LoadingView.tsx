import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/spacing';

type LoadingViewProps = {
  // What is loading, in words: "Loading cleanups…"
  label: string;
};

// The phone's own spinner with words under it, for the first load of a screen
export function LoadingView({ label }: LoadingViewProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.box}>
      {/* A screen reader reads the words below, so the spinner itself stays silent */}
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
