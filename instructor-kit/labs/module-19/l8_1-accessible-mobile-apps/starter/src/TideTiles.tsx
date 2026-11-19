import { StyleSheet, Text, View } from 'react-native';

type TideTilesProps = { low: string; high: string };

// Task 3: today's tides, two tiles side by side. At the largest text sizes the times ran into each other, and
// someone "fixed" it by switching the phone's text size off for these texts.
export function TideTiles({ low, high }: TideTilesProps) {
  // TODO 3: let the text grow again, and put the tiles on top of each other at large text instead
  return (
    <View testID="tides" style={styles.row}>
      <View style={styles.tile}>
        <Text allowFontScaling={false} style={styles.time}>
          {low}
        </Text>
        <Text allowFontScaling={false}>Low tide</Text>
      </View>
      <View style={styles.tile}>
        <Text allowFontScaling={false} style={styles.time}>
          {high}
        </Text>
        <Text allowFontScaling={false}>High tide</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#bfe3df' },
  time: { fontSize: 28, fontWeight: '700' },
});
