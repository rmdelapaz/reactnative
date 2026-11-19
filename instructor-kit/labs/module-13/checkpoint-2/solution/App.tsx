// `npm run web` shows a page (optional): the checkpoint itself is the tests, `npm test`
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.page}>
      <Text accessibilityRole="header" style={styles.title}>
        Checkpoint 2
      </Text>
      <Text>The checkpoint is the tests: npm test, then npm run typecheck and npm run lint.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, gap: 8, padding: 24, justifyContent: 'center', backgroundColor: '#f4f1fb' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2a1257' },
});
