import * as Linking from 'expo-linking';

import type { CleanupEvent } from '@/api/types';
import { formatDate } from '@/utils/format';

/**
 * A link that opens one cleanup in Shoreline Crew. Linking.createURL builds it for wherever the
 * app is running: shorelinecrew://cleanups/e08 in a build of the app, exp://…/--/cleanups/e08 in
 * Expo Go, and http://localhost:8081/cleanups/e08 in the web preview.
 */
export function cleanupLink(id: string): string {
  return Linking.createURL(`/cleanups/${id}`);
}

/** The words a volunteer shares: what, when, where to meet, and the link */
export function cleanupMessage(event: CleanupEvent, link: string): string {
  return [
    `Join me at ${event.title}!`,
    `${formatDate(event.date)}, ${event.startTime} to ${event.endTime}. Meet at ${event.meetingPoint}.`,
    link,
  ].join('\n');
}
