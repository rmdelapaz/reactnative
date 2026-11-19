import { focusManager } from '@tanstack/react-query';
import type { PermissionResponse } from 'expo';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/** What every Expo permission Hook returns: the answer so far (null until read), ask, and read again */
export type PermissionHookResult = [
  PermissionResponse | null,
  () => Promise<PermissionResponse>,
  () => Promise<PermissionResponse>,
];

/**
 * Where the app stands with one permission (Lesson 6.1):
 * 'checking' the answer is being read · 'not-asked' never asked: explain, then ask ·
 * 'denied' a no, and the phone may ask again · 'blocked' a no only Settings can change · 'granted' yes
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
  // The web preview always says canAskAgain: true, but a browser never asks again after a "Block"
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
 * One permission, as a step: usePermission(Location.useForegroundPermissions()). The answer is read
 * again each time the app comes back to the foreground, so a change made in Settings shows at once.
 */
export function usePermission([response, ask, check]: PermissionHookResult): Permission {
  useEffect(
    () =>
      focusManager.subscribe((focused) => {
        if (focused) {
          void check();
        }
      }),
    [check],
  );
  return { step: permissionStep(response), ask, check };
}
