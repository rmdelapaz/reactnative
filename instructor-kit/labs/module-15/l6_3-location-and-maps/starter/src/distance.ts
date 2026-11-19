// The straight-line distance between two places on Earth, in kilometers (the haversine formula,
// as in Lesson 6.1's distance.ts)
import type { Place } from './types';

const earthRadiusKm = 6371;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function distanceKm(from: Place, to: Place): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}
