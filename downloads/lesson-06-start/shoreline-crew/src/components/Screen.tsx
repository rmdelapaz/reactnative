import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type ScreenProps = {
  children: ReactNode;
  // true: the content scrolls when it is taller than the screen
  scroll?: boolean;
};

// Every screen starts here: the page color from edge to edge, and the same padding and gaps.
// Lesson 2.3 keeps the content clear of the notch and the home indicator.
export function Screen({ children, scroll = false }: ScreenProps) {
  if (scroll) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.screen, styles.content]}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // fill the space the navigator gives the screen, not just the content's height
    backgroundColor: colors.page,
  },
  content: {
    gap: spacing.md,
    padding: spacing.md,
  },
});
