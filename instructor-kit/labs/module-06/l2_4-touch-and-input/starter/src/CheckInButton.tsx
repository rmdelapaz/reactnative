import { Pressable, StyleSheet, Text } from 'react-native';

type CheckInButtonProps = {
  name: string;
  checkedIn: boolean;
  onCheckIn: () => void;
  onUndo: () => void;
};

// Task 1: copied from a web page, and it shows. It type-checks and lints clean, and on a phone nothing happens when
// a finger presses it. A screen reader cannot tell it is a button, and it is 36 high (a mouse is fine with that,
// a gloved thumb on the beach is not). Fix it: a tap checks the volunteer in, and once they are in, a long press
// undoes it (a second, optional action). Show the press while the finger is down.
export function CheckInButton({ name, checkedIn, onCheckIn }: CheckInButtonProps) {
  return (
    <Pressable onClick={onCheckIn} style={styles.button}>
      <Text style={styles.label}>{checkedIn ? `${name}: checked in` : `Check in ${name}`}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { height: 36, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#1f6f8b' },
  done: { backgroundColor: '#2d6a4f' },
  pressed: { backgroundColor: '#0b3954' },
  label: { color: '#ffffff', fontWeight: '600' },
});
