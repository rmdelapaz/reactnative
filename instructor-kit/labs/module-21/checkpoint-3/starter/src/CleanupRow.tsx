import { Pressable, StyleSheet, Text, View } from 'react-native';

type CleanupRowProps = {
  title: string;
  spotsLeft: number;
  onJoin: () => void;
};

// C1 (Lesson 8.1): one row of a cleanup list. It looks right, and a screen reader cannot use it.
// Make src/c1.test.tsx pass WITHOUT editing the test file:
//   - the title is a heading
//   - the Join button is a button whose name STARTS with the words you see: "Join Tide Pool..."
//   - the wave is decoration: a screen reader skips it
//   - a full cleanup's Join button is switched off, and the row says "Full"
export function CleanupRow({ title, spotsLeft, onJoin }: CleanupRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.wave}>🌊</Text>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text>{spotsLeft === 1 ? '1 spot left' : `${spotsLeft} spots left`}</Text>
      </View>
      <Pressable onPress={onJoin} style={styles.join}>
        <Text>Join</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  wave: { fontSize: 24 },
  text: { flex: 1 },
  title: { fontSize: 18, fontWeight: '600' },
  join: { minWidth: 64, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
});
