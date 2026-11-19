import * as Linking from 'expo-linking';

import type { CleanupEvent } from './types';

/** A link that opens one cleanup. createURL picks the form: build, Expo Go or the web preview. */
export function cleanupLink(id: string): string {
  return Linking.createURL(`/cleanups/${id}`);
}

/** The words a volunteer shares: what, where, when to meet, and the link on its own line */
export function inviteMessage(event: CleanupEvent, link: string): string {
  return [
    `Join me at ${event.title} (${event.site.name})!`,
    `Meet at ${event.meetingPoint}, ${event.startTime}.`,
    link,
  ].join('\n');
}
