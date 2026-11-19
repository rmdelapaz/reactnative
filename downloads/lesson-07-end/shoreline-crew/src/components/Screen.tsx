import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { type Edge, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type ScreenProps = {
  children: ReactNode;
  // true: the content scrolls when it is taller than the screen
  scroll?: boolean;
  // The edges of the phone this screen touches. Leave out an edge that a header or a tab bar covers.
  edges?: readonly Edge[];
};

const allEdges: readonly Edge[] = ['top', 'right', 'bottom', 'left'];

// Every screen starts here: the page color from edge to edge, the same padding and gaps,
// and content kept clear of the status bar, the notch and the home indicator.
export function Screen({ children, scroll = false, edges = allEdges }: ScreenProps) {
  const insets = useSafeAreaInsets();
  // How much of each edge the phone covers (0 where it covers nothing, or the edge is left out)
  const clear = (edge: Edge) => (edges.includes(edge) ? insets[edge] : 0);

  // The frame stays out from under the status bar and the notch (and the sides in landscape)...
  const frame = { paddingTop: clear('top'), paddingRight: clear('right'), paddingLeft: clear('left') };
  // ...and the content ends above the home indicator, so the last card can scroll clear of it
  const end = { paddingBottom: spacing.md + clear('bottom') };

  if (scroll) {
    return (
      <ScrollView
        style={[styles.screen, frame]}
        contentContainerStyle={[styles.content, end]}
        // A tap on a button while the keyboard is open presses the button (and keeps the keyboard)
        keyboardShouldPersistTaps="handled"
        // Starting to scroll puts the keyboard away
        keyboardDismissMode="on-drag"
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <View style={[styles.screen, frame]}>
      <View style={[styles.fill, styles.content, end]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // fill the space the navigator gives the screen, not just the content's height
    backgroundColor: colors.page,
  },
  fill: {
    flex: 1,
  },
  content: {
    gap: spacing.md,
    padding: spacing.md,
  },
});
