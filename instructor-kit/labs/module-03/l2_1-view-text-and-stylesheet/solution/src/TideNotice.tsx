import { StyleSheet, Text, View } from 'react-native';

import { colors } from './theme';

// Sizes are numbers, lineHeight is a size, and text styles go on the Text: a View passes nothing on
export function TideNotice({ lowTide }: { lowTide: string }) {
  return (
    <View testID="tide-notice" style={styles.box}>
      <Text accessibilityRole="header" style={styles.heading}>
        Check the tide
      </Text>
      <Text style={styles.body}>Low tide at {lowTide}. Meet on the sand, not on the rocks.</Text>
      <Text style={styles.small}>Tide times from the harbor office</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.notice,
  },
  heading: {
    color: colors.heading,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'bold',
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
