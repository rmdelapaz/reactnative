import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

// Fades in and out, over and over, while a cleanup is happening right now
const pulse = {
  from: { opacity: 1 },
  to: { opacity: 0.3 },
};

// TODO 2a: hold the dot still (no pulse) for people who turned on Reduce Motion.
// TODO 2b: the dot is decoration (the words say it): screen readers should skip it, on iPhone and on Android.
export function LiveBadge() {
  return (
    <View style={styles.row}>
      <Animated.View testID="live-dot" style={[styles.dot, styles.pulsing]} />
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
