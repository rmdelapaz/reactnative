import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

// How much of a supply has been handed out, from 0 to 100: never less, never more, even when the numbers are odd
export function filledPercent(given: number, stock: number): number {
  if (stock <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round((100 * given) / stock)));
}

type SuppliesBarProps = { given: number; stock: number; item: string };

// A bar for the supply table at a cleanup: when given changes, the fill glides to its new width by itself
export function SuppliesBar({ given, stock, item }: SuppliesBarProps) {
  return (
    <View style={styles.track} accessible accessibilityLabel={`${given} of ${stock} ${item} handed out`}>
      <Animated.View testID="fill" style={[styles.fill, { width: `${filledPercent(given, stock)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: 5, backgroundColor: '#bfe3df' },
  fill: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1f6f8b',
    // CSS-style: when the width changes, slide there in 400 ms, slowing down at the end
    transitionProperty: 'width',
    transitionDuration: 400,
    transitionTimingFunction: 'ease-out',
  },
});
