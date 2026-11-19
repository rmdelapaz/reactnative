import { Pressable, StyleSheet, Text, View } from 'react-native';

type BagCounterProps = {
  count: number;
  onChange: (count: number) => void;
  max?: number;
};

// How many bags a volunteer filled: minus, the count, plus. Each button is named for a screen
// reader, the count is a live text (Android says the new number), and the icon is decoration.
export function BagCounter({ count, onChange, max = 20 }: BagCounterProps) {
  return (
    <View style={styles.row}>
      <Text aria-hidden style={styles.icon}>
        ♻
      </Text>
      <Text style={styles.label}>Bags filled</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="One bag fewer"
        disabled={count === 0}
        onPress={() => onChange(count - 1)}
        style={styles.button}
      >
        <Text style={styles.sign}>−</Text>
      </Pressable>
      <Text accessibilityLiveRegion="polite" style={styles.count}>
        {count === 1 ? '1 bag' : `${count} bags`}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="One more bag"
        disabled={count === max}
        onPress={() => onChange(count + 1)}
        style={styles.button}
      >
        <Text style={styles.sign}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  icon: { fontSize: 20 },
  label: { flex: 1, fontSize: 16 },
  button: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  sign: { fontSize: 24 },
  count: { minWidth: 64, textAlign: 'center', fontSize: 16 },
});
