import { Pressable, StyleSheet, Text } from 'react-native';

type CheckInButtonProps = {
  name: string;
  checkedIn: boolean;
  onCheckIn: () => void;
  onUndo: () => void;
};

// A tap checks the volunteer in (onPress: a complete tap, not onClick); once in, a long press undoes it. A long
// press never also counts as a tap. The role and label are for screen readers; minHeight 48 is a finger's target.
export function CheckInButton({ name, checkedIn, onCheckIn, onUndo }: CheckInButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={checkedIn ? `${name}, checked in. Hold to undo` : `Check in ${name}`}
      onPress={() => {
        if (!checkedIn) onCheckIn();
      }}
      onLongPress={() => {
        if (checkedIn) onUndo();
      }}
      style={({ pressed }) => [styles.button, checkedIn && styles.done, pressed && styles.pressed]}>
      <Text style={styles.label}>{checkedIn ? `${name}: checked in` : `Check in ${name}`}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#1f6f8b' },
  done: { backgroundColor: '#2d6a4f' },
  pressed: { backgroundColor: '#0b3954' },
  label: { color: '#ffffff', fontWeight: '600' },
});
