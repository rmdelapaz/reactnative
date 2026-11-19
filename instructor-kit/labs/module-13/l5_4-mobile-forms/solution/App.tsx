// `npm run web` shows the form (optional): the lab itself is the tests, `npm test`
import { StyleSheet, Text, View } from 'react-native';

import { ShiftReportForm } from './src/ShiftReportForm';

export default function App() {
  return (
    <View style={styles.page}>
      <Text accessibilityRole="header" style={styles.title}>
        Shift report
      </Text>
      <ShiftReportForm onSend={(report) => console.log('Sent', report)} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingTop: 48, backgroundColor: '#f4f1fb' },
  title: { paddingHorizontal: 16, fontSize: 22, fontWeight: 'bold', color: '#2a1257' },
});
