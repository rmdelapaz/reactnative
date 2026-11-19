// The Not sent yet list for the signed-in volunteer: waiting reports and refused ones (with Remove)
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { type QueuedReport, useHazardQueue } from './hazardQueue';

const kindWords = { glass: 'Broken glass', animal: 'An animal in trouble', current: 'A strong current' };

export function NotSentList({ viewer }: { viewer: string }) {
  // filter builds a new array on every call: useShallow compares the items instead
  const mine = useHazardQueue(
    useShallow((state) => state.reports.filter((item) => item.volunteerId === viewer)),
  );
  const removeReport = useHazardQueue((state) => state.remove);

  if (mine.length === 0) {
    return <Text>Nothing waiting: every report is on the server.</Text>;
  }
  return (
    <View style={styles.list}>
      <Text accessibilityRole="header" style={styles.heading}>
        Not sent yet
      </Text>
      {mine.map((item: QueuedReport) => {
        const what = `${kindWords[item.report.kind]} at ${item.report.siteId}`;
        return (
          <View key={item.report.clientId} style={styles.card}>
            <Text>{what}</Text>
            {item.status === 'waiting' ? (
              <Text>
                Waiting to be sent{item.attempts > 0 && ` (tries so far: ${item.attempts})`}
              </Text>
            ) : (
              <>
                <Text>Not sent: {item.problem}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove the report: ${what}`}
                  onPress={() => removeReport(item.report.clientId)}
                >
                  <Text>Remove</Text>
                </Pressable>
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  heading: { fontSize: 20, fontWeight: 'bold' },
  card: { gap: 4, padding: 12, borderRadius: 8, backgroundColor: '#ffffff' },
});
