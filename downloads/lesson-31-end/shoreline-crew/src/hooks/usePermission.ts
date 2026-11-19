import { focusManager } from '@tanstack/react-query';
import type { PermissionResponse } from 'expo';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * What every Expo permission Hook returns (Location.useForegroundPermissions,
 * ImagePicker.useCameraPermissions, ...): the answer so far (null until it has been read),
 * a function that asks the person, and one that only reads the answer again.
 */
export type PermissionHookResult = [
  PermissionResponse | null,
  () => Promise<PermissionResponse>,
  () => Promise<PermissionResponse>,
];

/**
 * Where the app stands with one permission:
 * 'checking'  the answer is being read (nobody is asked)
 * 'not-asked' the phone has never asked: explain, then ask
 * 'denied'    the answer was no, and the phone may ask again
 * 'blocked'   the answer was no, and only the Settings app can change it
 * 'granted'   yes
 */
export type PermissionStep = 'checking' | 'not-asked' | 'denied' | 'blocked' | 'granted';

export function permissionStep(response: PermissionResponse | null): PermissionStep {
  if (response === null) {
    return 'checking';
  }
  if (response.granted) {
    return 'granted';
  }
  if (response.status === 'undetermined') {
    return 'not-asked';
  }
  // The web preview's answers always say canAskAgain: true, but a browser never asks again after
  // a "Block": treat a no there as blocked
  if (!response.canAskAgain || Platform.OS === 'web') {
    return 'blocked';
  }
  return 'denied';
}

export type Permission = {
  step: PermissionStep;
  ask: () => Promise<PermissionResponse>;
  check: () => Promise<PermissionResponse>;
};

/**
 * One permission, as a step. Pass it an Expo permission Hook's result:
 * usePermission(Location.useForegroundPermissions()). The answer is read again each time the app
 * comes back to the foreground, so a change made in the Settings app shows up at once.
 */
export function usePermission([response, ask, check]: PermissionHookResult): Permission {
  useEffect(
    () =>
      // The focus manager from Lesson 5.2: AppState on a phone, the browser tab on the web
      focusManager.subscribe((focused) => {
        if (focused) {
          void check();
        }
      }),
    [check],
  );
  return { step: permissionStep(response), ask, check };
}
