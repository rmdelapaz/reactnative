import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Easing,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

// The bags a crew filled today, counting up when the number changes. A number must never pass its target:
// withTiming lands exactly on it (a spring would overshoot and show totals that were never true).
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
    // get() and set(): the React Compiler leaves method calls alone
    count.set(withTiming(bags, { duration: 900, easing: Easing.out(Easing.cubic) }));
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
