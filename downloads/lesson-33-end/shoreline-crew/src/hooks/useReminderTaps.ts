import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

import { remindersWork } from '@/notifications/reminders';
import { isCleanupPath } from '@/utils/links';

/**
 * A tap on a reminder opens its cleanup: the tap that started the app, and every tap while it runs.
 * Use once, in the root layout, with true once the screens are on show.
 */
export function useReminderTaps(ready: boolean): void {
  useEffect(() => {
    if (!ready || !remindersWork) {
      return;
    }
    function open(response: Notifications.NotificationResponse) {
      // A notification's data comes from outside the app: check it, and only ever open a screen
      const url = response.notification.request.content.data?.url;
      if (isCleanupPath(url)) {
        router.push(url);
      }
    }
    // The app was closed, and a tap on a reminder opened it
    const first = Notifications.getLastNotificationResponse();
    if (first !== null) {
      open(first);
      Notifications.clearLastNotificationResponse(); // handled: never open it twice
    }
    const subscription = Notifications.addNotificationResponseReceivedListener(open);
    return () => subscription.remove();
  }, [ready]);
}
