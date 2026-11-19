// What `npm run web` shows: the loans on a plain screen (not a test). Drag a row left with the mouse.
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { LoanList } from './src/LoanList';

const loans = [
  { id: 'g1', item: 'litter grabber', borrower: 'Theo' },
  { id: 'g2', item: 'bucket', borrower: 'Maya' },
];

export default function App() {
  return (
    <GestureHandlerRootView style={styles.screen}>
      <LoanList loans={loans} onReturned={() => {}} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fbf6ec' },
});
