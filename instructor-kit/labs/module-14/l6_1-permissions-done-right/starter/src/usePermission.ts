// One permission, as a step (Lesson 6.1's pattern, for any Expo permission)
import type { PermissionResponse } from 'expo';
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
  // TODO 1: every no is 'denied' here, so the gate keeps offering "Ask me again" after the
  // phone has stopped asking. canAskAgain false means only Settings can help ('blocked'), and
  // on the web (os === 'web') canAskAgain is always true but a browser never asks again.
  return 'denied';
}

export type Permission = {
  step: PermissionStep;
  ask: () => Promise<PermissionResponse>;
  check: () => Promise<PermissionResponse>;
};

export function usePermission([response, ask, check]: PermissionHookResult): Permission {
  // TODO 3b: Expo's Hook reads the answer once. Read it again (check) each time TanStack Query's
  // focusManager says the app is back in the foreground, so a change made in Settings shows.
  return { step: permissionStep(response), ask, check };
}
