// The supply van: on the day of a cleanup it parks near the meeting point with the gear kits
// (gloves, a grabber, bags). Practice data for this lab: shoreline-api has no vans or kits.
import type { LocationObjectCoords } from 'expo-location';

/** A point on the map: all a LatLng is */
export type Place = { latitude: number; longitude: number };

/** What expo-location's getCurrentPositionAsync answers, the parts this lab reads */
export type Position = {
  coords: Pick<LocationObjectCoords, 'latitude' | 'longitude' | 'accuracy'>; // accuracy: meters, or null
  mocked?: boolean;
};

export const van = { latitude: 36.9791, longitude: -122.1185 } satisfies Place;
export const vanLabel = 'Supply van, Otter Creek car park';
