import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { describeError, getEvents } from '@/api/client';
import type { CleanupEvent } from '@/api/types';
import { getAvailability } from '@/utils/availability';
import { formatDate } from '@/utils/format';

// Temporary: proves the shared code works on a phone. Lesson 2.1 turns this into a real screen.
type Load =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | { status: 'loaded'; events: CleanupEvent[] };

function spotsText(event: CleanupEvent): string {
  const availability = getAvailability(event);
  switch (availability.kind) {
    case 'open':
      return availability.spotsLeft === 1 ? '1 spot left' : `${availability.spotsLeft} spots left`;
    case 'full':
      return 'Full';
    case 'closed':
      return 'Closed';
  }
}

export default function Index() {
  const [load, setLoad] = useState<Load>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    getEvents('when=upcoming', controller.signal)
      .then((page) => setLoad({ status: 'loaded', events: page.items }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoad({ status: 'failed', message: describeError(error) });
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Shoreline Crew
      </Text>
      <Text style={styles.tagline}>Many hands, cleaner sands.</Text>

      {load.status === 'loading' && <Text>Loading cleanups…</Text>}
      {load.status === 'failed' && (
        <Text accessibilityRole="alert" style={styles.error}>
          {load.message}
        </Text>
      )}
      {load.status === 'loaded' &&
        load.events.map((event) => (
          <Text key={event.id} style={styles.event}>
            {event.title} · {formatDate(event.date)} · {spotsText(event)}
          </Text>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0b3954',
  },
  tagline: {
    fontSize: 18,
    color: '#1f6f8b',
  },
  event: {
    fontSize: 16,
    color: '#1f2a37',
  },
  error: {
    fontSize: 16,
    color: '#b23a22',
  },
});
