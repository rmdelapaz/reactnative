import { type ScrollViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createThemedStyles } from '../hooks/useTheme';
import { layout, spacing } from '../theme/spacing';

// The props that turn a list into a whole screen (Lesson 3.1's useScreenScroll): the page color, the safe
// areas, the padding and the keyboard rules. Spread them in: <FlatList {...screen} data={...} />
export function useScreenScroll() {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  return {
    style: [styles.screen, { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }],
    contentContainerStyle: [styles.content, { paddingBottom: spacing.md + insets.bottom }],
    keyboardShouldPersistTaps: 'handled',
    keyboardDismissMode: 'on-drag',
  } satisfies ScrollViewProps;
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.page },
  content: {
    gap: spacing.md,
    padding: spacing.md,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
}));
