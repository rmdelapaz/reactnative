import { Pressable, StyleSheet, Text } from 'react-native';

type PackingItemProps = { label: string; packed: boolean; onToggle: (packed: boolean) => void };

// Task 1: one line of the "What to bring" list (gloves, sunscreen, water). The whole row is one control: a
// screen reader stops once ("Gloves, checkbox, checked") and a finger anywhere on the row toggles it.
export function PackingItem({ label, packed, onToggle }: PackingItemProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label} // the name is the words people see, without the picture
      aria-checked={packed}
      onPress={() => onToggle(!packed)}
      style={styles.row}
    >
      <Text style={styles.label}>{label}</Text>
      {/* A picture of the state: the role and aria-checked already say it */}
      <Text aria-hidden style={styles.box}>
        {packed ? '☑' : '☐'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 48 },
  label: { flex: 1 },
  box: { fontSize: 24 },
});
