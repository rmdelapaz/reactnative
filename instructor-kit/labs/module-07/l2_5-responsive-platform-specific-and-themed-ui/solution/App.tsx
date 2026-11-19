// What `npm run web` shows: the tiles on a themed page (not a test). Resize the browser window; switch your
// computer (or Chrome DevTools > Rendering) to dark mode.
import { ScrollView, StyleSheet } from 'react-native';

import sites from './fixtures/sites.json';
import { SiteGrid } from './src/SiteGrid';
import { useTheme } from './src/theme/theme';

export default function App() {
  const { colors } = useTheme();
  return (
    <ScrollView style={{ backgroundColor: colors.page }} contentContainerStyle={styles.content}>
      <SiteGrid sites={sites} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
});
