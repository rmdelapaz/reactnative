// Tests (do not edit): npm test. Jest has no keychain, so expo-secure-store is stood in for by jest.fn()s
// that the tests program: the same four calls the course app uses.
import * as SecureStore from 'expo-secure-store';

import saved from '../fixtures/sign-in-theo.json';
import { restoreSession, sessionKey } from './savedSession';
import { readSession, setSession } from './session';
import type { Session } from './types';

jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
const store = jest.mocked(SecureStore);
const theo = saved as Session; // a real answer of POST /api/auth/sign-in

beforeEach(() => {
  setSession(null);
  jest.clearAllMocks();
  store.isAvailableAsync.mockResolvedValue(true);
  store.setItemAsync.mockResolvedValue();
  store.deleteItemAsync.mockResolvedValue();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

test('Task 2: the web preview has no secure storage: memory only, no error', async () => {
  // what expo-secure-store 58 does in the web preview (Lesson 4.3 measured it)
  store.isAvailableAsync.mockResolvedValue(false);
  store.getItemAsync.mockRejectedValue(
    new TypeError('ExpoSecureStore.default.getValueWithKeyAsync is not a function'),
  );
  await expect(restoreSession()).resolves.toBeUndefined();
  expect(store.getItemAsync).not.toHaveBeenCalled();
  expect(readSession()).toBeNull();
});

test('Task 2: damaged data means nobody is signed in, not a crash', async () => {
  store.getItemAsync.mockResolvedValue('{"token": "st_1", "us');
  await expect(restoreSession()).resolves.toBeUndefined();
  expect(readSession()).toBeNull();
});

test('Task 2: data saved in an older shape is not trusted', async () => {
  store.getItemAsync.mockResolvedValue('{"token": "st_1"}');
  await restoreSession();
  expect(readSession()).toBeNull();
});

test('Task 2: a saved session comes back, and every change is saved', async () => {
  store.getItemAsync.mockResolvedValue(JSON.stringify(theo));
  await restoreSession();
  expect(store.getItemAsync).toHaveBeenCalledWith(sessionKey);
  expect(readSession()).toEqual(theo);
  setSession(null); // signing out deletes the saved copy
  expect(store.deleteItemAsync).toHaveBeenCalledWith(sessionKey);
  setSession(theo); // signing in saves it
  expect(store.setItemAsync).toHaveBeenCalledWith(sessionKey, JSON.stringify(theo));
});
