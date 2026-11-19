// Where the van is, on the phone's own map (Apple Maps on an iPhone, Google Maps on Android).
// The web preview uses VanMap.web.tsx instead: react-native-maps has no web version.
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import type { Place } from './types';

type VanMapProps = {
  van: Place;
  label: string;
  locationAllowed: boolean; // the volunteer said yes to location earlier
};

export function VanMap({ van, label, locationAllowed }: VanMapProps) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{ ...van, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      // The blue dot only after a yes: on an iPhone the prop alone would make the phone ask
      showsUserLocation={locationAllowed}
      accessibilityLabel={`Map with a pin at the ${label}`}
    >
      <Marker coordinate={van} title={label} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 220, // a map has no size of its own
    borderRadius: 12,
  },
});
