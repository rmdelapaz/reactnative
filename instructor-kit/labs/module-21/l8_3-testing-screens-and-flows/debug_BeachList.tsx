import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Site } from './types';

type Face = { kind: 'loading' } | { kind: 'failed'; status: number } | { kind: 'loaded'; sites: Site[] };

// The beaches from GET /api/sites, with the three faces every list has: loading, failed, loaded
export function BeachList({ apiUrl }: { apiUrl: string }) {
  const [face, setFace] = useState<Face>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0); // Try again asks for one more attempt

  useEffect(() => {
    let current = true; // an answer that arrives after the list is gone is ignored
    fetch(`${apiUrl}/api/sites`).then(async (response) => {
      if (!current) return;
      if (!response.ok) {
        setFace({ kind: 'failed', status: response.status });
        return;
      }
      const sites = (await response.json()) as Site[];
      if (current) setFace({ kind: 'loaded', sites });
    });
    return () => {
      current = false;
    };
  }, [apiUrl, attempt]);

  function tryAgain() {
    setFace({ kind: 'loading' });
    setAttempt((n) => n + 1);
  }

  if (face.kind === 'loading') {
    return <Text>Loading beaches…</Text>;
  }
  if (face.kind === 'failed') {
    return (
      <View style={styles.box}>
        <Text>Could not load the beaches ({face.status}).</Text>
        <Pressable accessibilityRole="button" onPress={() => setFace({ kind: 'loading' })} style={styles.button}>
          <Text>Try again</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.box}>
      <Text accessibilityRole="header" style={styles.heading}>
        {face.sites.length} beaches
      </Text>
      {face.sites.map((site) => (
        <Text key={site.id}>
          {site.name}, {site.town}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 8 },
  heading: { fontSize: 20, fontWeight: '600' },
  button: { minHeight: 48, justifyContent: 'center' },
});
