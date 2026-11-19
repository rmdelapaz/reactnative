// What `npm run web` shows: the name this build was made as (not a test)
import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.screen}>
      <Text style={styles.name}>{Constants.expoConfig?.name ?? 'Shoreline Lookout'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fbf6ec' },
  name: { fontSize: 24, fontWeight: '600', color: '#0b3954' },
});
