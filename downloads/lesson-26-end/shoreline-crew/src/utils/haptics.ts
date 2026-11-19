// Feedback you can feel (new): a short buzz when something the volunteer did has gone through, or
// has not. Never the only feedback: every buzz comes with words on the screen.
import {
  AndroidHaptics,
  NotificationFeedbackType,
  notificationAsync,
  performAndroidHapticsAsync,
} from 'expo-haptics';
import { Platform } from 'react-native';

import { readSettings } from '@/state/settings';

export type Feeling = 'success' | 'error';

/** A short buzz that says "done" or "that did not work"; nothing when the volunteer turned it off */
export function feel(feeling: Feeling): void {
  if (!readSettings().hapticsOn) {
    return;
  }
  const buzz =
    Platform.OS === 'android'
      ? // Android's own haptic effects, played the way the phone's touch feedback setting allows
        performAndroidHapticsAsync(
          feeling === 'success' ? AndroidHaptics.Confirm : AndroidHaptics.Reject,
        )
      : // The iPhone's Taptic Engine (in a browser: navigator.vibrate, where there is one)
        notificationAsync(
          feeling === 'success'
            ? NotificationFeedbackType.Success
            : NotificationFeedbackType.Error,
        );
  // A buzz that could not play is never worth an error: the words on the screen say it all
  buzz.catch(() => {});
}
