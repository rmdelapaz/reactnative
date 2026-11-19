import * as Location from 'expo-location';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import type { Site } from '@/api/types';
import { usePermission } from '@/hooks/usePermission';
import { radius } from '@/theme/spacing';

type SiteMapProps = {
  site: Site;
  meetingPoint: string; // the pin's title: where the crew meets
};

// Where the crew meets, on the phone's own map (Apple Maps on an iPhone, Google Maps on Android).
// The web preview uses SiteMap.web.tsx instead: react-native-maps has no web version.
export function SiteMap({ site, meetingPoint }: SiteMapProps) {
  // Reading the answer asks nobody (Lesson 6.1). The blue dot only with a yes from before:
  // showsUserLocation on its own would make an iPhone ask, with no reason given
  const location = usePermission(Location.useForegroundPermissions());
  return (
    <MapView
      style={styles.map}
      // Where the map starts. The volunteer can pan and zoom from there (region would hold it still)
      initialRegion={{
        latitude: site.latitude,
        longitude: site.longitude,
        latitudeDelta: 0.01, // about a kilometer from top to bottom
        longitudeDelta: 0.01,
      }}
      showsUserLocation={location.step === 'granted'}
      accessibilityLabel={`Map of ${site.name}, with a pin at the meeting point: ${meetingPoint}`}
    >
      <Marker coordinate={site} title={meetingPoint} description={site.name} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 220, // a map has no size of its own: without one it is 0 high
    borderRadius: radius.picture,
  },
});
