import type { CleanupEvent } from '../api/types';
import { formatDate } from '../utils/format';

// Copied: plain TypeScript about the data. Rewritten: whatever asked the browser (its address bar, its storage).

/** The spots line on a card (copied unchanged) */
export function spotsText(event: CleanupEvent): string {
  const left = event.capacity - event.spotsTaken;
  if (left <= 0) return 'Full';
  return left === 1 ? '1 spot left' : `${left} spots left`;
}

/** What the Share button sends (rewritten): a phone has no page address to link to (links come in Lesson 4.4) */
export function shareMessage(event: CleanupEvent): string {
  return `Join me at ${event.title} on ${formatDate(event.date)}. Find it in the Shoreline Crew app.`;
}

/** The greeting (rewritten): a phone has no browser storage; the screen passes the name it has (Lesson 4.3) */
export function greeting(name: string | null = null): string {
  return name ? `Welcome back, ${name}!` : 'Welcome, volunteer!';
}
