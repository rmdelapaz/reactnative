import type { Stop } from '@/api/types';
import { type Coordinates, distanceKm } from '@/utils/distance';

/** TODO R5c (done). The stop closest to here, and how far it is (null: there are no stops) */
export function nearestStop(stops: Stop[], here: Coordinates): { stop: Stop; km: number } | null {
  let best: { stop: Stop; km: number } | null = null;
  for (const stop of stops) {
    const km = distanceKm(here, stop);
    if (best === null || km < best.km) {
      best = { stop, km };
    }
  }
  return best;
}
