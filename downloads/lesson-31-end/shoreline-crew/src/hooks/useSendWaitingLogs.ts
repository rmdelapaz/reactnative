import { focusManager, onlineManager } from '@tanstack/react-query';
import { useEffect } from 'react';

import { sendWaitingLogs } from '@/state/sendLogs';

/**
 * Send the signed-in volunteer's waiting debris logs: now (the app opened, or someone signed in),
 * and again each time the phone is back online or the app is back in the foreground.
 * Use once, in the root layout, with null until the saved queue has loaded.
 */
export function useSendWaitingLogs(volunteerId: string | null): void {
  useEffect(() => {
    if (volunteerId === null) {
      return;
    }
    const send = () => {
      void sendWaitingLogs(volunteerId);
    };
    send();
    // The two managers from Lesson 5.2: NetInfo and AppState on a phone, the browser on the web
    const stopOnline = onlineManager.subscribe((online) => {
      if (online) {
        send();
      }
    });
    const stopFocus = focusManager.subscribe((focused) => {
      if (focused) {
        send();
      }
    });
    return () => {
      stopOnline();
      stopFocus();
    };
  }, [volunteerId]);
}
