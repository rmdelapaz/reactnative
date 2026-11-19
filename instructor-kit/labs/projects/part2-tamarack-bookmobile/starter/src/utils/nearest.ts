import type { Stop } from '@/api/types';
import type { Coordinates } from '@/utils/distance';

/**
 * TODO R5c. The stop closest to here (distanceKm from src/utils/distance.ts), and how far it is in
 * kilometers; null when there are no stops.
 */
export function nearestStop(stops: Stop[], here: Coordinates): { stop: Stop; km: number } | null {
  throw new Error(`TODO R5c: the nearest of ${stops.length} stops to ${here.latitude}, ${here.longitude}`);
}
