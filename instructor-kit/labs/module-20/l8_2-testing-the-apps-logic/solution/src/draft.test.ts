// Task 2 (reference): there is no keychain under Jest. The automatic mock below makes every
// function of expo-secure-store an empty jest.fn() that answers undefined.
import * as SecureStore from 'expo-secure-store';

import { draftKey, loadDraft, rememberDraft } from './draft';

jest.mock('expo-secure-store');
const secureStore = jest.mocked(SecureStore);

const draft = { eventId: 'e08', note: 'Two bags of rope near the jetty' };

// A phone with a keychain: it is there, and saving works (an empty mock would answer undefined)
beforeEach(() => {
  secureStore.isAvailableAsync.mockResolvedValue(true);
  secureStore.setItemAsync.mockResolvedValue();
});

afterEach(() => jest.clearAllMocks());

it('saves the draft under its key', () => {
  rememberDraft(draft);
  expect(secureStore.setItemAsync).toHaveBeenCalledWith(draftKey, JSON.stringify(draft));
});

it('loads the draft saved on the phone', async () => {
  secureStore.getItemAsync.mockResolvedValue(JSON.stringify(draft));
  expect(await loadDraft()).toEqual(draft);
});

it('starts empty when the saved text is not a draft', async () => {
  secureStore.getItemAsync.mockResolvedValue('{"eventId": 8}');
  expect(await loadDraft()).toBeNull();
});
