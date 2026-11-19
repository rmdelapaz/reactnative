import { StyleSheet, TextInput } from 'react-native';

// onChangeText gives the new text as a plain string, so a state setter can go straight in. inputMode="numeric"
// shows the number keyboard on a phone; the value is still a string (parseBags turns it into a number).
export function BagCountField({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      accessibilityLabel="Bags collected"
      inputMode="numeric"
      maxLength={3}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 48, borderWidth: 1, borderColor: '#5b6573', borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
});
