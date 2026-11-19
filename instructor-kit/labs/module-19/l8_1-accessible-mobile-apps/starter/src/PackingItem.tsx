import { Pressable, StyleSheet, Text, View } from 'react-native';

type PackingItemProps = { label: string; packed: boolean; onToggle: (packed: boolean) => void };

// Task 1: one line of the "What to bring" list (gloves, sunscreen, water). The audit found two stops for a
// screen reader (the words, then a box called "button") and a 24-point target: only the box answers a finger.
export function PackingItem({ label, packed, onToggle }: PackingItemProps) {
  // TODO 1: make the whole row the control: one stop that says the words, its role and its state
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Pressable accessibilityRole="button" onPress={() => onToggle(!packed)} style={styles.box}>
        <Text>{packed ? '☑' : '☐'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  label: { flex: 1 },
  box: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
});
