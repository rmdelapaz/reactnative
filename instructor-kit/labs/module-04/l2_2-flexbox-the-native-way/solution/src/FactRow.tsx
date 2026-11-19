import { StyleSheet, Text, View } from 'react-native';

// Label and value: the label is a fixed width so the values line up; the value takes the rest of the row and wraps
export function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text testID={`label-${label}`} style={styles.label}>
        {label}
      </Text>
      <Text testID={`value-${label}`} style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    width: 88,
    color: '#5b6573',
  },
  value: {
    flex: 1, // take the space the label leaves, and wrap inside it
  },
});
