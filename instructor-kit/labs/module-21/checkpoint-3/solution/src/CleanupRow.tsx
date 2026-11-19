import { Pressable, StyleSheet, Text, View } from 'react-native';

type CleanupRowProps = {
  title: string;
  spotsLeft: number;
  onJoin: () => void;
};

// C1 (Lesson 8.1): one row of a cleanup list, as a screen reader meets it: a heading, the words,
// and one button whose name starts with what is written on it. The wave is decoration.
export function CleanupRow({ title, spotsLeft, onJoin }: CleanupRowProps) {
  const full = spotsLeft === 0;
  return (
    <View style={styles.row}>
      <Text aria-hidden style={styles.wave}>
        🌊
      </Text>
      <View style={styles.text}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text>{full ? 'Full' : spotsLeft === 1 ? '1 spot left' : `${spotsLeft} spots left`}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Join ${title}`}
        disabled={full}
        onPress={onJoin}
        style={styles.join}
      >
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
