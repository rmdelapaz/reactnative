import { StyleSheet, TextInput } from 'react-native';

// Task 2: the HQ's input, copied: onChange with event.target.value. Run npm run typecheck and read both errors,
// then make the field work: React Native hands you the new text as a string. It is a count of bags, so ask the
// phone for the number keyboard (it only changes the keys: the value is still a string).
export function BagCountField({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) {
  return (
    <TextInput
      value={value}
      onChange={(event) => onChangeText(event.target.value)}
      accessibilityLabel="Bags collected"
      maxLength={3}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 48, borderWidth: 1, borderColor: '#5b6573', borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
});
