import { focusManager, onlineManager } from '@tanstack/react-query';
import { useEffect } from 'react';

import { sendWaitingHolds } from '@/state/sendHolds';

/**
 * Send the signed-in patron's waiting holds (Lesson 5.5): now (the app opened, or someone signed in),
 * and again each time the phone is back online or the app is back in the foreground.
 * Use once, in the root layout, with null until the saved queue has loaded.
 */
export function useSendWaitingHolds(patronId: string | null): void {
  useEffect(() => {
    if (patronId === null) {
      return;
    }
    const send = () => {
      void sendWaitingHolds(patronId);
    };
    send();
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
  }, [patronId]);
}
