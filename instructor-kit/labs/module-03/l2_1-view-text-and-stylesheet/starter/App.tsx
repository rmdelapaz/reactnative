// What `npm run web` shows: the lab's components on a plain screen (a look, not a test)
import { ScrollView, StyleSheet } from 'react-native';

import { CrewText } from './src/CrewText';
import { DebrisTally } from './src/DebrisTally';
import { colors, spacing } from './src/theme';
import { TideNotice } from './src/TideNotice';

export default function App() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TideNotice lowTide="6:40 AM" />
      <CrewText variant="label">Meeting point</CrewText>
      <CrewText>North parking lot, by the lifeguard tower</CrewText>
      <CrewText variant="warning">High surf today: stay off the jetty</CrewText>
      <DebrisTally pieces={42} bags={3} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.page },
  content: { gap: spacing.md, padding: spacing.md },
});
