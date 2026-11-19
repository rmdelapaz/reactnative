// What `npm run web` shows: the lab's components on a plain screen (a look, not a test)
import { StyleSheet, View } from 'react-native';

import { SignUpDesk } from './src/SignUpDesk';
import { WelcomeBanner } from './src/WelcomeBanner';

export default function App() {
  return (
    <View style={styles.screen}>
      <WelcomeBanner crewName="Shoreline Crew" />
      <SignUpDesk open />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', gap: 24, padding: 24, backgroundColor: '#fbf6ec' },
});
