import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

// The bags a crew filled today, counting up when the number changes.
// TODO 3: npm run lint reports one error here, and the count uses a spring copied from an old tutorial.
// Fix both (Lesson 7.1, Common Mistakes).
export function BagCounter({ bags }: { bags: number }) {
  const count = useSharedValue(0);
  const [shown, setShown] = useState(0);

  // On the UI thread: a new whole number? Then tell React, once per number, not once per frame
  useAnimatedReaction(
    () => Math.round(count.get()),
    (now, before) => {
      if (now !== before) {
        scheduleOnRN(setShown, now);
      }
    },
  );

  useEffect(() => {
    count.value = withSpring(bags, { mass: 1, stiffness: 100, damping: 10 });
  }, [bags, count]);

  return (
    <View style={styles.box} accessible accessibilityLabel={`${bags} ${bags === 1 ? 'bag' : 'bags'} filled`}>
      <Text style={styles.number}>{shown}</Text>
      <Text>{bags === 1 ? 'bag' : 'bags'} filled</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', padding: 12, borderRadius: 12, backgroundColor: '#ffffff' },
  number: { fontSize: 32, fontWeight: '700' },
});
