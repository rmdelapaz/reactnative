import type { CleanupEvent } from './types';

// Plain TypeScript: it works the same in a phone app and in a web app
export function spotsLabel(event: CleanupEvent): string {
  const left = Math.max(0, event.capacity - event.spotsTaken);
  if (left === 0) return 'Full: join the waiting list';
  return left === 1 ? '1 spot left' : `${left} spots left`;
}
