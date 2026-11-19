import type { CleanupEvent, Site } from '@/api/types';

// Does a cleanup match what the volunteer typed? Every word must appear somewhere in the title,
// the description, or the beach's name and town (the API's own search rule, plus the town).
export function matchesSearch(event: CleanupEvent, site: Site | undefined, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const text = [event.title, event.description, site?.name, site?.town].join(' ').toLowerCase();
  return words.every((word) => text.includes(word));
}
