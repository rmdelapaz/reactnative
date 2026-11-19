import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/components/AppText';
import { useLargeText } from '@/hooks/useLargeText';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';

type TallyProps = {
  /** The number to show. When it changes, the tally counts up (or down) to it. */
  value: number;
  /** What is counted, after the number: "pieces" */
  label: string;
  /** Digits after the decimal point: 1 for kilograms */
  decimals?: number;
};

// A number that counts to its value while the screen is in view, then gives a small bounce
export function Tally({ value, label, decimals = 0 }: TallyProps) {
  const steps = 10 ** decimals; // 10 steps per kilogram, 1 per piece
  // Shared values live on the UI thread. The count starts at 0, so opening the logbook counts up once.
  const count = useSharedValue(0);
  const scale = useSharedValue(1);
  // The number the Text shows. React draws again only when it reaches the next step.
  const [shown, setShown] = useState(0);
  // True while counting: the tally's background lights up, with a CSS-style transition
  const [counting, setCounting] = useState(false);
  const styles = useStyles();
  const largeText = useLargeText();

  // On the UI thread, every frame: has the count reached a new step? Then tell React (JS thread).
  useAnimatedReaction(
    () => Math.round(count.get() * steps),
    (step, previous) => {
      if (step !== previous) {
        scheduleOnRN(setShown, step / steps);
      }
    },
  );

  // Count when the screen comes into view, and when the value changes while it is in view
  useFocusEffect(
    useCallback(() => {
      if (count.get() === value) {
        return;
      }
      setCounting(true);
      const counted = {
        duration: 900,
        easing: Easing.out(Easing.cubic), // fast at first, slowing down at the end
        reduceMotion: ReduceMotion.System, // the default, written out: Reduce Motion on = jump to the end
      };
      count.set(
        withTiming(value, counted, (finished) => {
          // Runs on the UI thread when the count stops (finished is false if something interrupted it)
          if (finished) {
            scheduleOnRN(setCounting, false);
            // A bounce: grow quickly, then spring back. dampingRatio below 1 lets it overshoot a little.
            scale.set(
              withSequence(
                withTiming(1.2, { duration: 120 }),
                withSpring(1, { dampingRatio: 0.35, duration: 500 }),
              ),
            );
          }
        }),
      );
    }, [count, scale, value]),
  );

  const bounce = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    // A screen reader hears the final number once, not every step on the way
    <Animated.View
      style={[styles.tally, largeText && styles.half, counting && styles.counting]}
      accessible
      accessibilityLabel={`${value} ${label}`}
    >
      <Animated.View style={bounce}>
        <AppText variant="title">{shown}</AppText>
      </Animated.View>
      <AppText variant="muted">{label}</AppText>
    </Animated.View>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  tally: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    // CSS-style: when the background changes, fade between the two colors
    transitionProperty: 'backgroundColor',
    transitionDuration: 300,
  },
  half: {
    minWidth: '40%', // with large text, two tallies to a row (the row wraps), not four
  },
  counting: {
    backgroundColor: colors.pressed,
  },
}));
