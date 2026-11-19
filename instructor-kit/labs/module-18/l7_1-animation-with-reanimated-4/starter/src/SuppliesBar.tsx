import { StyleSheet, View } from 'react-native';

// TODO 1a: how much of a supply has been handed out, from 0 to 100 (12 of 40 = 30). Never more than 100 (a
// volunteer brought extra gloves: 50 of 40), never a division by 0 (stock 0: 0).
export function filledPercent(given: number, stock: number): number {
  return (100 * given) / stock;
}

type SuppliesBarProps = { given: number; stock: number; item: string };

// A bar for the supply table at a cleanup.
// TODO 1b: when given changes, the fill should glide to its new width in 400 ms (ease-out), not jump.
export function SuppliesBar({ given, stock, item }: SuppliesBarProps) {
  return (
    <View style={styles.track} accessible accessibilityLabel={`${given} of ${stock} ${item} handed out`}>
      <View testID="fill" style={[styles.fill, { width: `${filledPercent(given, stock)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: 5, backgroundColor: '#bfe3df' },
  fill: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1f6f8b',
  },
});
