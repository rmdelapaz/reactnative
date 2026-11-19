import type { CleanupEvent } from '@/api/types';

// What an event card says about spots. Each kind carries only the data that kind needs.
export type Availability =
  | { kind: 'open'; spotsLeft: number }
  | { kind: 'full' }
  | { kind: 'closed' };

export function getAvailability(event: CleanupEvent): Availability {
  if (event.status !== 'scheduled') {
    return { kind: 'closed' };
  }
  const spotsLeft = event.capacity - event.spotsTaken;
  return spotsLeft > 0 ? { kind: 'open', spotsLeft } : { kind: 'full' };
}
