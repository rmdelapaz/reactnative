import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useSession } from '@/hooks/useSession';
import { updateReminders } from '@/notifications/reminders';
import { useSettings } from '@/state/settings';

/**
 * Keep the phone's reminders in step with the sign-ups: once the saved session and settings have
 * loaded, again whenever someone signs in or out or the reminders switch changes, and each time the
 * app is back in the foreground (sign-ups made on another device, a permission changed in Settings).
 * Use once, in the root layout.
 */
export function useReminders(loaded: boolean): void {
  const session = useSession();
  const { remindersOn } = useSettings();
  const volunteerId = session?.user.id ?? null;

  useEffect(() => {
    if (!loaded) {
      return; // before the saved session loads, "nobody signed in" would cancel every reminder
    }
    void updateReminders();
    // The focus manager from Lesson 5.2: AppState on a phone
    return focusManager.subscribe((focused) => {
      if (focused) {
        void updateReminders();
      }
    });
  }, [loaded, volunteerId, remindersOn]);
}
