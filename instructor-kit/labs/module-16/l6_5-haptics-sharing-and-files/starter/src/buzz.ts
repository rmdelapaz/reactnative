// A short buzz when a gear checkout goes through, or does not. Never the only feedback: the screen
// says what happened too, so a buzz that cannot play costs nothing.
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { Platform } from 'react-native';

export type Outcome = 'success' | 'error';

/** Buzz for an outcome: nothing when the volunteer turned the switch off */
export function buzz(outcome: Outcome, hapticsOn: boolean, os: string = Platform.OS): void {
  // TODO 2: the volunteer's switch, each platform's own words for "done" and "did not work",
  // and a buzz that cannot play is never an error
  void impactAsync(outcome === 'success' ? ImpactFeedbackStyle.Light : ImpactFeedbackStyle.Heavy);
}
