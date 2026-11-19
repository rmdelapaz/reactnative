// A stand-in for a native module's permission functions (a real app would use expo-audio's).
// In the tests it plays the phone: they set what the phone answers, and count the questions.
import { createPermissionHook, PermissionStatus, type PermissionResponse } from 'expo';

export const answers = {
  notAsked: { status: PermissionStatus.UNDETERMINED, granted: false, canAskAgain: true, expires: 'never' },
  granted: { status: PermissionStatus.GRANTED, granted: true, canAskAgain: true, expires: 'never' },
  denied: { status: PermissionStatus.DENIED, granted: false, canAskAgain: true, expires: 'never' },
  blocked: { status: PermissionStatus.DENIED, granted: false, canAskAgain: false, expires: 'never' },
} satisfies Record<string, PermissionResponse>;

export const fakePhone = {
  current: answers.notAsked as PermissionResponse, // what Settings holds for this app right now
  whenAsked: answers.granted as PermissionResponse, // what the person taps if the phone asks
  reads: 0,
  questions: 0, // how many times the phone's own question appeared
};

/** Reads the answer; never asks */
export async function getMicrophonePermissionsAsync(): Promise<PermissionResponse> {
  fakePhone.reads += 1;
  return fakePhone.current;
}

/** Asks, if the phone still may (not asked yet, or Android's one extra chance); else answers at once */
export async function requestMicrophonePermissionsAsync(): Promise<PermissionResponse> {
  const mayAsk = fakePhone.current.status === PermissionStatus.UNDETERMINED || fakePhone.current.canAskAgain;
  if (mayAsk && !fakePhone.current.granted) {
    fakePhone.questions += 1;
    fakePhone.current = fakePhone.whenAsked;
  }
  return fakePhone.current;
}

/** The Hook, built the way every Expo module builds its own: [answer so far, ask, read again] */
export const useMicrophonePermissions = createPermissionHook({
  getMethod: getMicrophonePermissionsAsync,
  requestMethod: requestMicrophonePermissionsAsync,
});
