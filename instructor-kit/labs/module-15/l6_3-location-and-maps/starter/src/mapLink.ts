// A link that opens a place in the phone's own map app, for directions: Apple Maps on an iPhone,
// whichever map app handles geo: links on Android, OpenStreetMap in a browser
import { Platform } from 'react-native';

import type { Place } from './types';

export function mapLinkFor(os: string, { latitude, longitude }: Place, label: string): string {
  const at = `${latitude},${longitude}`;
  switch (os) {
    case 'ios':
      return `https://maps.apple.com/?ll=${at}&q=${label}`;
    case 'android':
      return `geo:${at}?q=${label}`; // TODO (Task 2)
    default:
      return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
  }
}

/** The link for the platform the app runs on */
export function mapLink(place: Place, label: string): string {
  return mapLinkFor(Platform.OS, place, label);
}
