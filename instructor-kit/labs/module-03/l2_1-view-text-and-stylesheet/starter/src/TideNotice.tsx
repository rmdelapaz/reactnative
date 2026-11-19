import { StyleSheet, Text, View } from 'react-native';

import { colors } from './theme';

// Task 1: Shoreline Crew HQ's tide notice, translated line by line from its CSS (TASKS.md has the CSS).
// Four web habits came along: tsc reports one of them, and the other three fail without a word.
export function TideNotice({ lowTide }: { lowTide: string }) {
  return (
    <View testID="tide-notice" style={styles.box}>
      <Text accessibilityRole="header">Check the tide</Text>
      <Text style={styles.body}>Low tide at {lowTide}. Meet on the sand, not on the rocks.</Text>
      <Text style={styles.small}>Tide times from the harbor office</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: 4,
    padding: '12px',
    borderRadius: 12,
    backgroundColor: colors.notice,
    color: colors.heading, // the heading's color and size, set once for the whole box
    fontSize: 20,
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 1.5,
  },
  small: {
    color: colors.textMuted,
    fontSize: '14px',
  },
});
