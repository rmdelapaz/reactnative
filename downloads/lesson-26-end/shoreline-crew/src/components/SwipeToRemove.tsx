import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/components/AppText';
import { Icon } from '@/components/Icon';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';

type SwipeToRemoveProps = {
  children: ReactNode;
  /** Called on the JavaScript thread when the row is swiped far enough to the left */
  onSwipe: () => void;
  /** false: the row does not move (removing is not allowed right now) */
  enabled?: boolean;
};

const reach = 120; // how far to the left (in points) the finger must pull the row...
const flick = -800; // ...or how fast (points per second, leftwards) a short flick must be

// A row the finger can pull to the left. Let go far enough and it asks to be removed (onSwipe);
// either way it springs back into place. A shortcut: the row must have a Remove button too.
export function SwipeToRemove({ children, onSwipe, enabled = true }: SwipeToRemoveProps) {
  const offset = useSharedValue(0); // how far the row has moved, in points
  const styles = useStyles();

  const pan = usePanGesture({
    enabled,
    activeOffsetX: [-12, 12], // 12 points sideways first: this is a swipe...
    failOffsetY: [-10, 10], // ...10 points up or down first: a scroll, so the swipe lets go
    // These run on the UI thread, many times a second, while the finger moves
    onUpdate: (event) => {
      offset.set(Math.min(0, event.translationX)); // follow the finger, leftwards only
    },
    onDeactivate: (event) => {
      if (offset.get() < -reach || event.velocityX < flick) {
        scheduleOnRN(onSwipe); // React decides what a swipe means
      }
      offset.set(withSpring(0)); // back into place, from wherever the finger let go
    },
  });

  const moved = useAnimatedStyle(() => ({ transform: [{ translateX: offset.get() }] }));
  // The word behind the row shows more as the row moves: fully there at the reach
  const revealed = useAnimatedStyle(() => ({
    opacity: interpolate(offset.get(), [-reach, 0], [1, 0], 'clamp'),
  }));

  return (
    <View>
      {/* Behind the row. Only a picture of what the swipe does: screen readers skip it */}
      <Animated.View
        style={[styles.behind, revealed]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Icon name="remove" color={styles.word.color} />
        <AppText style={styles.word}>Remove</AppText>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={moved}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const useStyles = createThemedStyles(({ badges }) => StyleSheet.create({
  behind: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    backgroundColor: badges.danger.background,
  },
  word: {
    color: badges.danger.text,
    fontWeight: '600',
  },
}));
