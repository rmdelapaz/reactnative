import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

// Hooks first, every render, in the same order; the early return comes after them
export function SignUpDesk({ open }: { open: boolean }) {
  const [count, setCount] = useState(0);
  if (!open) {
    return <Text>Sign-ups are closed</Text>;
  }
  return (
    <View>
      <Text>{count} signed up at the desk</Text>
      <Pressable accessibilityRole="button" onPress={() => setCount(count + 1)}>
        <Text>Add a volunteer</Text>
      </Pressable>
    </View>
  );
}
