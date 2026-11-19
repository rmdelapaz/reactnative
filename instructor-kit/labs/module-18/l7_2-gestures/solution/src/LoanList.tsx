import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwipeToReturn } from './SwipeToReturn';

export type Loan = { id: string; item: string; borrower: string };

// The gear shed's loans. Swipe a loan (or press Return) and the row asks before marking it returned.
// Which loan is being asked about lives HERE, keyed by id, not in the rows (rows can be recycled).
export function LoanList({ loans, onReturned }: { loans: Loan[]; onReturned: (id: string) => void }) {
  const [asking, setAsking] = useState<string | null>(null);
  return (
    <View style={styles.list}>
      {loans.map((loan) => (
        <SwipeToReturn key={loan.id} onSwipe={() => setAsking(loan.id)}>
          <View style={styles.card}>
            <Text style={styles.item}>{loan.item}</Text>
            <Text>Lent to {loan.borrower}</Text>
            {asking === loan.id ? (
              <View style={styles.choices}>
                <Text accessibilityLiveRegion="polite">Has {loan.borrower} brought it back?</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setAsking(null);
                    onReturned(loan.id);
                  }}
                  style={styles.button}
                >
                  <Text>Yes, returned</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => setAsking(null)} style={styles.button}>
                  <Text>Not yet</Text>
                </Pressable>
              </View>
            ) : (
              // The way that needs no gesture: a finger that taps, a keyboard, a screen reader, switch control
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Return the ${loan.item} lent to ${loan.borrower}`}
                onPress={() => setAsking(loan.id)}
                style={styles.button}
              >
                <Text>Return</Text>
              </Pressable>
            )}
          </View>
        </SwipeToReturn>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  card: { gap: 4, padding: 16, borderRadius: 12, backgroundColor: '#ffffff' },
  item: { fontWeight: '600' },
  choices: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  button: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#bfe3df' },
});
