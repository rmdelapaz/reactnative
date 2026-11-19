// `npm run web` shows this page (optional): the lab itself is the tests, `npm test`
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.page}>
      <Text accessibilityRole="header" style={styles.title}>
        Lab 5.3: Storing Data on the Device
      </Text>
      <Text>The lab is the tests: npm test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, gap: 8, padding: 24, justifyContent: 'center', backgroundColor: '#f4f1fb' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2a1257' },
});
