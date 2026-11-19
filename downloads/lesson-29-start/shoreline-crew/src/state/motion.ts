// Reduce Motion, followed while the app runs. Reanimated reads the phone's setting once, when the
// app starts; this store keeps listening, and adds the app's own switch (settings.ts).
import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';

import { useSettings } from '@/state/settings';

// What the phone says right now: iPhone Reduce Motion, Android Remove animations, or the
// browser's prefers-reduced-motion in the web preview
let phoneReduces = false;
const listeners = new Set<() => void>();

function setPhoneReduces(reduces: boolean) {
  phoneReduces = reduces;
  for (const listener of listeners) {
    listener();
  }
}

/** Read the phone's setting and follow its changes from now on. Call it once, at startup. */
export async function loadMotion(): Promise<void> {
  // Listen first, so a change made while the first answer is on its way is not lost
  AccessibilityInfo.addEventListener('reduceMotionChanged', setPhoneReduces);
  try {
    setPhoneReduces(await AccessibilityInfo.isReduceMotionEnabled());
  } catch (error) {
    console.warn('Could not read the Reduce Motion setting', error);
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** true while the phone's own setting asks for less motion */
export function usePhoneReducesMotion(): boolean {
  // The web preview's server has no phone: full motion until the page is running
  return useSyncExternalStore(subscribe, () => phoneReduces, () => false);
}

/** true when motion should step aside: the phone asks for it, or the volunteer did, in the app */
export function useReduceMotion(): boolean {
  const phone = usePhoneReducesMotion();
  const { reduceMotion } = useSettings();
  return phone || reduceMotion;
}
