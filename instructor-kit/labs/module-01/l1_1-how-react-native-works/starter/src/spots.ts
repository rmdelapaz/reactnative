import type { CleanupEvent } from './types';

// Task 3: plain TypeScript, nothing React Native about it: it would work unchanged in Shoreline Crew HQ.
//   no spots left -> 'Full: join the waiting list'    one -> '1 spot left'    more -> '5 spots left'
export function spotsLabel(event: CleanupEvent): string {
  throw new Error(`TODO 3: the label for ${event.title}`);
}
