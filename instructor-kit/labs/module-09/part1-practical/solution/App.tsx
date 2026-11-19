// npm run web: the list in the web preview (optional)
import { View } from 'react-native';

import { SignUpList } from './src/SignUpList';

export default function App() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <SignUpList />
    </View>
  );
}
