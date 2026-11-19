// A short buzz when a gear checkout goes through, or does not. Never the only feedback: the screen
// says what happened too, so a buzz that cannot play costs nothing.
import {
  AndroidHaptics,
  NotificationFeedbackType,
  notificationAsync,
  performAndroidHapticsAsync,
} from 'expo-haptics';
import { Platform } from 'react-native';

export type Outcome = 'success' | 'error';

/** Buzz for an outcome: nothing when the volunteer turned the switch off */
export function buzz(outcome: Outcome, hapticsOn: boolean, os: string = Platform.OS): void {
  if (!hapticsOn) {
    return;
  }
  const played =
    os === 'android'
      ? // Android's own effects, played the way the phone's touch feedback setting allows
        performAndroidHapticsAsync(outcome === 'success' ? AndroidHaptics.Confirm : AndroidHaptics.Reject)
      : // The iPhone's patterns (in a browser: navigator.vibrate, where there is one)
        notificationAsync(outcome === 'success' ? NotificationFeedbackType.Success : NotificationFeedbackType.Error);
  // A buzz that could not play is never worth an error
  played.catch(() => {});
}
