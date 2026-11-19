import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

type TideTilesProps = { low: string; high: string };

// Task 3: today's tides, two tiles side by side; with large text, one on top of the other. Every text grows
// with the phone's setting (the person's word); the big times grow at most 1.75 times, like a title.
export function TideTiles({ low, high }: TideTilesProps) {
  const { fontScale } = useWindowDimensions(); // re-renders when the text size changes
  const largeText = fontScale >= 1.5;
  return (
    <View testID="tides" style={[styles.row, largeText && styles.stack]}>
      <View style={styles.tile}>
        <Text maxFontSizeMultiplier={1.75} style={styles.time}>
          {low}
        </Text>
        <Text>Low tide</Text>
      </View>
      <View style={styles.tile}>
        <Text maxFontSizeMultiplier={1.75} style={styles.time}>
          {high}
        </Text>
        <Text>High tide</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  stack: { flexDirection: 'column' },
  tile: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#bfe3df' },
  time: { fontSize: 28, fontWeight: '700' },
});
