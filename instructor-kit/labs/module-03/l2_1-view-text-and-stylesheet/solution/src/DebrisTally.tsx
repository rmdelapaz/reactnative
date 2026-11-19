import { StyleSheet, Text } from 'react-native';

import { CrewText } from './CrewText';

// A Text inside a Text inherits the line's color, size and line height: only the weight changes
export function DebrisTally({ pieces, bags }: { pieces: number; bags: number }) {
  return (
    <CrewText>
      <Text style={styles.strong}>{pieces}</Text> pieces of debris in {bags} {bags === 1 ? 'bag' : 'bags'}
    </CrewText>
  );
}

const styles = StyleSheet.create({
  strong: {
    fontWeight: 'bold',
  },
});
