// One permission, as a step (Lesson 6.1's pattern, for any Expo permission)
import { focusManager } from '@tanstack/react-query';
import type { PermissionResponse } from 'expo';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/** What every Expo permission Hook returns: the answer so far (null at first), ask, read again */
export type PermissionHookResult = [
  PermissionResponse | null,
  () => Promise<PermissionResponse>,
  () => Promise<PermissionResponse>,
];

export type PermissionStep = 'checking' | 'not-asked' | 'denied' | 'blocked' | 'granted';

export function permissionStep(response: PermissionResponse | null, os: string = Platform.OS): PermissionStep {
  if (response === null) {
    return 'checking';
  }
  if (response.granted) {
    return 'granted';
  }
  if (response.status === 'undetermined') {
    return 'not-asked';
  }
  // canAskAgain false: only Settings can change it. On the web the answer always says true,
  // but a browser never asks again after a block: treat a no there as blocked
  if (!response.canAskAgain || os === 'web') {
    return 'blocked';
  }
  return 'denied';
}

export type Permission = {
  step: PermissionStep;
  ask: () => Promise<PermissionResponse>;
  check: () => Promise<PermissionResponse>;
};

export function usePermission([response, ask, check]: PermissionHookResult): Permission {
  // Expo's Hook reads once; read again each time the app is back in the foreground (from Settings)
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
