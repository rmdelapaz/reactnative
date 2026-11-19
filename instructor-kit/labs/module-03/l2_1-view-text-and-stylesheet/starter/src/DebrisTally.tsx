import { StyleSheet, Text, View } from 'react-native';

import { CrewText } from './CrewText';

// Task 3: one line, "42 pieces of debris in 3 bags", with only the number bold. Built the web way (a row of
// pieces), the number loses the line's color, size and line height, and no single Text holds the sentence.
export function DebrisTally({ pieces, bags }: { pieces: number; bags: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.strong}>{pieces}</Text>
      <CrewText>
        {' '}
        pieces of debris in {bags} {bags === 1 ? 'bag' : 'bags'}
      </CrewText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  strong: {
    fontWeight: 'bold',
  },
});
