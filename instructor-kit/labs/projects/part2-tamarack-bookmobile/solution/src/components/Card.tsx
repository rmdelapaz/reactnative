import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';

// A white box with a thin border: one stop, one book, one hold
export function Card({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <View style={styles.card}>{children}</View>;
}

const useStyles = createThemedStyles(({ colors }) =>
  StyleSheet.create({
    card: {
      gap: spacing.xs,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.card,
      backgroundColor: colors.surface,
    },
  }),
);
