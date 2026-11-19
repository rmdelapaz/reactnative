import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

import type { CleanupEvent } from '@/api/types';
import type { Coordinates } from '@/utils/distance';
import { formatDate } from '@/utils/format';

/** The path of one cleanup's screen: what a link, and a reminder, opens */
export function cleanupPath(id: string) {
  return `/cleanups/${id}` as const;
}

/**
 * Is this a path to a cleanup's screen? For paths that come from outside the app (a notification),
 * which only ever open a screen, and only one of these
 */
export function isCleanupPath(value: unknown): value is ReturnType<typeof cleanupPath> {
  return typeof value === 'string' && /^\/cleanups\/[\w-]+$/.test(value);
}

/**
 * A link that opens one cleanup in Shoreline Crew. Linking.createURL builds it for wherever the
 * app is running: shorelinecrew://cleanups/e08 in a build of the app, exp://…/--/cleanups/e08 in
 * Expo Go, and http://localhost:8081/cleanups/e08 in the web preview.
 */
export function cleanupLink(id: string): string {
  return Linking.createURL(cleanupPath(id));
}

/** The words a volunteer shares: what, when, where to meet, and the link */
export function cleanupMessage(event: CleanupEvent, link: string): string {
  return [
    `Join me at ${event.title}!`,
    `${formatDate(event.date)}, ${event.startTime} to ${event.endTime}. Meet at ${event.meetingPoint}.`,
    link,
  ].join('\n');
}

/**
 * A link that opens a place in the phone's own map app, for directions: Apple Maps on an iPhone,
 * whichever map app handles geo: links on an Android phone, OpenStreetMap in a browser
 */
export function mapLink({ latitude, longitude }: Coordinates, label: string): string {
  const at = `${latitude},${longitude}`;
  const name = encodeURIComponent(label);
  return Platform.select({
    ios: `https://maps.apple.com/?ll=${at}&q=${name}`,
    android: `geo:${at}?q=${at}(${name})`,
    default: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`,
  });
}
