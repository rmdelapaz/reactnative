import * as SecureStore from 'expo-secure-store';

import { readSession, setSession } from '@/api/client';
import { loadSession } from '@/auth/session';
import { volunteer } from '@/test/factories';

// No keychain under Jest: an automatic mock, where every function returns undefined until a
// test says what it should answer
jest.mock('expo-secure-store');
const secureStore = jest.mocked(SecureStore);

beforeEach(() => {
  setSession(null);
  secureStore.isAvailableAsync.mockResolvedValue(true);
  secureStore.setItemAsync.mockResolvedValue();
  secureStore.deleteItemAsync.mockResolvedValue();
});

it('starts signed in with the session saved on the phone, and saves every change', async () => {
  secureStore.getItemAsync.mockResolvedValue(JSON.stringify(volunteer));
  await loadSession();
  expect(readSession()).toEqual(volunteer);

  setSession(null); // signing out
  expect(secureStore.deleteItemAsync).toHaveBeenCalledWith('shoreline-crew-session');
});

it('starts signed out when the saved session is not a session', async () => {
  secureStore.getItemAsync.mockResolvedValue('{"token": 42}');
  await loadSession();
  expect(readSession()).toBeNull();
});
