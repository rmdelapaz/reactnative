// "Where is the van?" from the phone's position: a hint for the volunteer, never a rule (nothing is
// decided with it). A position is a circle, not a point: accuracy is its radius in meters.
import { distanceKm } from './distance';
import type { Place, Position } from './types';

export type VanHint = { kind: 'here' | 'near' | 'far' | 'unsure'; text: string };

const widest = 150; // a circle wider than this cannot say "here"

export function vanHint(here: Position, van: Place): VanHint {
  const { accuracy } = here.coords;
  if (accuracy === null || accuracy > widest) {
    // Under a cliff, in a creek valley: the phone does not know well enough. Say so
    return { kind: 'unsure', text: 'Your phone is not sure where you are. Look for the van at the car park.' };
  }
  const meters = distanceKm(here.coords, van) * 1000;
  if (meters <= 150) {
    return { kind: 'here', text: 'The van is right here.' };
  }
  if (meters <= 2000) {
    return { kind: 'near', text: `The van is about ${Math.round(meters / 100) * 100} m away.` };
  }
  return { kind: 'far', text: `The van is ${(meters / 1000).toFixed(1)} km away: is this the right beach?` };
}
