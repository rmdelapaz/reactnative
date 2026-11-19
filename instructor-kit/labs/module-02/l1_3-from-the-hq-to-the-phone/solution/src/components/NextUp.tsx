import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { describeError, getUpcoming } from '../api/client';
import type { CleanupEvent } from '../api/types';
import { formatDate } from '../utils/format';

type Load =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | { status: 'loaded'; next: CleanupEvent | undefined; total: number };

// The next cleanup, for the top of a volunteer's home screen (finished: the tasks are in the files it imports)
export function NextUp() {
  const [load, setLoad] = useState<Load>({ status: 'loading' });

  useEffect(() => {
    let current = true;
    getUpcoming(1)
      .then((page) => current && setLoad({ status: 'loaded', next: page.items[0], total: page.page.total }))
      .catch((error: unknown) => current && setLoad({ status: 'failed', message: describeError(error) }));
    return () => {
      current = false;
    };
  }, []);

  if (load.status === 'loading') return <Text>Looking for the next cleanup…</Text>;
  if (load.status === 'failed') {
    return (
      <Text accessibilityRole="alert" style={styles.error}>
        {load.message}
      </Text>
    );
  }
  if (load.next === undefined) return <Text>No cleanups coming up yet.</Text>;
  return (
    <View style={styles.box}>
      <Text accessibilityRole="header" style={styles.title}>
        Next up: {load.next.title}
      </Text>
      <Text>
        {formatDate(load.next.date)} · Meet at {load.next.meetingPoint}
      </Text>
      <Text>{load.total} upcoming cleanups in all</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 4, padding: 16, borderRadius: 12, backgroundColor: '#ffffff' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0b3954' },
  error: { fontSize: 16, color: '#b23a22' },
});
