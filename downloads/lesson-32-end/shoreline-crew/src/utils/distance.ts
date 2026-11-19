/** A point on the map, in degrees (a Site and a phone position both have these) */
export type Coordinates = { latitude: number; longitude: number };

const EARTH_RADIUS_KM = 6371;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** The straight-line distance between two points, in kilometers (the haversine formula) */
export function distanceKm(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/** "about 350 m", "about 3.2 km", "about 48 km" */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `about ${Math.max(10, Math.round(km * 100) * 10)} m`;
  }
  return `about ${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}
