import { StyleSheet, Text, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

// Fades in and out, over and over, while a cleanup is happening right now
const pulse = {
  from: { opacity: 1 },
  to: { opacity: 0.3 },
};

export function LiveBadge() {
  const reduceMotion = useReducedMotion(); // the phone's Reduce Motion, read when the app started
  return (
    <View style={styles.row}>
      {/* Decoration: the words say it, so screen readers skip the dot */}
      <Animated.View
        testID="live-dot"
        style={[styles.dot, !reduceMotion && styles.pulsing]}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Text style={styles.word}>Happening now</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c2410c' },
  pulsing: {
    animationName: pulse,
    animationDuration: '900ms',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
  },
  word: { fontWeight: '600', color: '#c2410c' },
});
