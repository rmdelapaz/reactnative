import type { CleanupEvent } from '../api/types';
import { formatDate } from '../utils/format';

// Task 1: three helpers copied from Shoreline Crew HQ's src/utils/. `npm run typecheck` accepts all three.
// Two of them still think they live in a browser. Which, and what does the phone version look like?

/** The spots line on a card (copied) */
export function spotsText(event: CleanupEvent): string {
  const left = event.capacity - event.spotsTaken;
  if (left <= 0) return 'Full';
  return left === 1 ? '1 spot left' : `${left} spots left`;
}

/** What the Share button sends: the HQ linked to the cleanup's page on the organizers' site */
export function shareMessage(event: CleanupEvent): string {
  return `Join me at ${event.title} on ${formatDate(event.date)}: ${window.location.origin}/events/${event.id}`;
}

/** The greeting at the top of the page: the HQ kept the signed-in name for the browser tab */
export function greeting(name: string | null = sessionStorage.getItem('shoreline-hq-name')): string {
  return name ? `Welcome back, ${name}!` : 'Welcome, volunteer!';
}
