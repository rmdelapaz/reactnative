import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

// Task 2: the sign-up desk on the day. Every test passes, and the linter still reports an error.
// Read it: React needs the same hooks, in the same order, on every render of a component.
export function SignUpDesk({ open }: { open: boolean }) {
  if (!open) {
    return <Text>Sign-ups are closed</Text>;
  }
  const [count, setCount] = useState(0);
  return (
    <View>
      <Text>{count} signed up at the desk</Text>
      <Pressable accessibilityRole="button" onPress={() => setCount(count + 1)}>
        <Text>Add a volunteer</Text>
      </Pressable>
    </View>
  );
}
