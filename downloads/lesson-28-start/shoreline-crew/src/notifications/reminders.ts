// Reminders before a cleanup (new): local notifications, scheduled on the phone itself. No server
// sends them: the phone's own scheduler shows them at the right time, even with no signal.
import { createPermissionHook } from 'expo';
import * as Notifications from 'expo-notifications';
// By name: ESLint's import/namespace rule cannot find this enum through Notifications.
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { readSession } from '@/api/client';
import { mySignupsQuery, queryClient, viewerId } from '@/api/queries';
import type { CleanupEvent } from '@/api/types';
import { readSettings } from '@/state/settings';
import { cleanupPath } from '@/utils/links';

/**
 * The web preview can ask for the permission (the browser's own question), but expo-notifications
 * has no scheduler there: reminders work in the app on a phone
 */
export const remindersWork = Platform.OS !== 'web';

// Android files every notification under a channel, which people can tune in Settings
const channelId = 'reminders';
// Every reminder's id starts with this, so the app can find its own among the phone's
const idPrefix = 'reminder-';

if (remindersWork) {
  // A reminder that arrives while Shoreline Crew is open is shown like any other (without this,
  // the phone shows nothing while the app is in the foreground)
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function askForNotifications() {
  if (Platform.OS === 'android') {
    // Android 13 and later ask only once the app has a channel: create it first
    await Notifications.setNotificationChannelAsync(channelId, {
      name: 'Cleanup reminders',
      importance: AndroidImportance.DEFAULT,
    });
  }
  // iPhone: alerts and sounds only, no badge on the app icon. (Android has one question.)
  return Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true } });
}

/**
 * expo-notifications has no permission Hook of its own: make one from its two functions, the way
 * every Expo module makes its own. Use it with usePermission(useNotificationPermissions()).
 */
export const useNotificationPermissions = createPermissionHook({
  getMethod: Notifications.getPermissionsAsync,
  requestMethod: askForNotifications,
});

/** When to remind: 6 pm the evening before the cleanup, by the phone's clock */
export function reminderTime(event: CleanupEvent): Date {
  const time = new Date(`${event.date}T18:00`);
  time.setDate(time.getDate() - 1);
  return time;
}

function reminderContent(event: CleanupEvent): Notifications.NotificationContentInput {
  return {
    title: `Tomorrow: ${event.title}`,
    body: `${event.startTime} to ${event.endTime}. Meet at ${event.meetingPoint}.`,
    // What a tap opens: the same path as a link to the cleanup (Lesson 4.4)
    data: { url: cleanupPath(event.id) },
  };
}

// The cleanups this phone should remind its volunteer about, soonest first: confirmed spots whose
// reminder time is still ahead. None when nobody is signed in, reminders are off, or notifications are not allowed.
async function cleanupsToRemind(): Promise<CleanupEvent[]> {
  const session = readSession();
  if (session === null || !readSettings().remindersOn) {
    return [];
  }
  const { granted } = await Notifications.getPermissionsAsync();
  if (!granted) {
    return [];
  }
  // The cached sign-ups if they are fresh, else a request (offline, it waits for the connection)
  const signups = await queryClient.fetchQuery(mySignupsQuery(viewerId(session)));
  const now = new Date();
  return signups
    .filter(({ status, event }) => status === 'confirmed' && reminderTime(event) > now)
    .map(({ event }) => event)
    .sort((a, b) => reminderTime(a).getTime() - reminderTime(b).getTime()); // soonest first
}

/**
 * Make the phone's reminders match the volunteer's sign-ups: cancel the ones nobody needs any more
 * (a cancelled sign-up, a different person signed in, reminders turned off), set the rest. Safe to
 * call any time, as often as you like: it always ends in the same state. It never fails.
 */
export async function updateReminders(): Promise<void> {
  if (!remindersWork) {
    return;
  }
  try {
    const events = await cleanupsToRemind();
    const wanted = new Set(events.map((event) => idPrefix + event.id));
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const { identifier } of scheduled) {
      if (identifier.startsWith(idPrefix) && !wanted.has(identifier)) {
        await Notifications.cancelScheduledNotificationAsync(identifier);
      }
    }
    // Scheduling with an id the phone already has replaces that reminder, so a cleanup whose
    // time changed gets the new time
    for (const event of events) {
      await Notifications.scheduleNotificationAsync({
        identifier: idPrefix + event.id,
        content: reminderContent(event),
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderTime(event),
          channelId,
        },
      });
    }
  } catch (error) {
    console.warn('Could not update the reminders', error);
  }
}

/**
 * For trying it out on your phone: the next cleanup's reminder, in 10 seconds instead of the
 * evening before. false when there is no cleanup to remind you about.
 */
export async function sendTestReminder(): Promise<boolean> {
  const [event] = await cleanupsToRemind();
  if (event === undefined) {
    return false;
  }
  await Notifications.scheduleNotificationAsync({
    identifier: 'test-reminder',
    content: reminderContent(event),
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 10, channelId },
  });
  return true;
}
