import type { ReactElement, ReactNode } from 'react';
import { type RefreshControlProps, ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';
import { type Edge, useSafeAreaInsets } from 'react-native-safe-area-context';

import { createThemedStyles } from '@/hooks/useTheme';
import { maxContentWidth, spacing } from '@/theme/spacing';

type ScreenProps = {
  children: ReactNode;
  // The edges of the phone this screen touches. Leave out an edge that a header or a tab bar covers.
  edges?: readonly Edge[];
  // Pull to refresh (Lesson 5.2): a <RefreshControl> for this screen's list
  refreshControl?: ReactElement<RefreshControlProps>;
};

// Every screen starts here: the page color, the same padding and gaps, content clear of the notch
// and the home indicator. Tab screens have a header and a tab bar: edges left and right only.
export function Screen({ children, edges = ['left', 'right'], refreshControl }: ScreenProps) {
  const screen = useScreenScroll(edges);
  return (
    <ScrollView {...screen} refreshControl={refreshControl}>
      {children}
    </ScrollView>
  );
}

// The props that turn any scrolling view into a whole screen
export function useScreenScroll(edges: readonly Edge[]) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const clear = (edge: Edge) => (edges.includes(edge) ? insets[edge] : 0);
  return {
    style: [styles.screen, { paddingTop: clear('top'), paddingRight: clear('right'), paddingLeft: clear('left') }],
    contentContainerStyle: [styles.content, { paddingBottom: spacing.md + clear('bottom') }],
    keyboardShouldPersistTaps: 'handled',
    keyboardDismissMode: 'on-drag',
  } satisfies ScrollViewProps;
}

const useStyles = createThemedStyles(({ colors }) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.page,
    },
    content: {
      gap: spacing.md,
      padding: spacing.md,
      width: '100%',
      maxWidth: maxContentWidth,
      alignSelf: 'center',
    },
  }),
);
