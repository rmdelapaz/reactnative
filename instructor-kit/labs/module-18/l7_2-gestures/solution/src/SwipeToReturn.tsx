import type { ReactNode } from 'react';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { shouldAsk } from './release';

type SwipeToReturnProps = { children: ReactNode; onSwipe: () => void; enabled?: boolean };

// A row the finger can pull to the left; far or fast enough and it calls onSwipe. Either way it springs back.
export function SwipeToReturn({ children, onSwipe, enabled = true }: SwipeToReturnProps) {
  const offset = useSharedValue(0);

  const pan = usePanGesture({
    testID: 'swipe-to-return', // how the tests find this gesture
    enabled,
    activeOffsetX: [-12, 12], // sideways first: a swipe
    failOffsetY: [-10, 10], // up or down first: a scroll
    onUpdate: (event) => {
      offset.set(Math.min(0, event.translationX));
    },
    onDeactivate: (event) => {
      if (shouldAsk(offset.get(), event.velocityX)) {
        scheduleOnRN(onSwipe);
      }
      offset.set(withSpring(0));
    },
  });

  const moved = useAnimatedStyle(() => ({ transform: [{ translateX: offset.get() }] }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={moved}>{children}</Animated.View>
    </GestureDetector>
  );
}
