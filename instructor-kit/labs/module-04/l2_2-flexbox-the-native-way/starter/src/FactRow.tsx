import { StyleSheet, Text, View } from 'react-native';

// Task 2: a label and its value side by side. The values should all start at the same place, and a long value
// (the parking line) should wrap inside its own column. In the web preview this may already look fine: on a phone,
// a Text in a row that is not allowed to shrink keeps its width and runs past the edge.
export function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text testID={`label-${label}`} style={styles.label}>
        {label}
      </Text>
      <Text testID={`value-${label}`}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    color: '#5b6573',
  },
});
