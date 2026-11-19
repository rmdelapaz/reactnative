// The web preview's VanMap. react-native-maps draws the phone's own map views, which a browser does
// not have (importing it here stops the web bundle), so the same place goes in words instead.
import { StyleSheet, Text, View } from 'react-native';

import type { Place } from './types';

type VanMapProps = {
  van: Place;
  label: string;
  locationAllowed: boolean;
};

export function VanMap({ label }: VanMapProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.center}>{label}</Text>
      <Text style={styles.center}>
        The map shows in the app on a phone. In the web preview, Open in Maps shows the place in a new
        browser tab.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 220, // the same space the map takes on a phone
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c9bfae',
  },
  center: { textAlign: 'center' },
});
