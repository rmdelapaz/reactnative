// The library's acceptance tests (GIVEN, do not edit): npm test. Each test name starts with the
// requirement and the TODO it checks; work through the TODOs and watch them pass.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, screen, userEvent, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { Stack } from 'expo-router';
import { http, HttpResponse } from 'msw';

import { postSignIn, setSession } from '@/api/client';
import { isBook, isHold, isStop } from '@/api/guards';
import { queryClient } from '@/api/queries';
import { holdSchema } from '@/api/schemas';
import BooksScreen from '@/app/(tabs)/books';
import HoldsScreen from '@/app/(tabs)/holds';
import StopsScreen from '@/app/(tabs)/index';
import TabLayout from '@/app/(tabs)/_layout';
import PlaceHoldScreen from '@/app/hold/[bookId]';
import StopScreen from '@/app/stops/[id]';
import { loadSession, sessionKey } from '@/auth/session';
import { AppText } from '@/components/AppText';
import { NearestStop } from '@/components/NearestStop';
import { type HoldToSend, loadHoldQueue, useHoldQueue } from '@/state/holdQueue';
import { changeMyStop, loadMyStop, readMyStop, settingsKey } from '@/state/myStop';
import { sendWaitingHolds } from '@/state/sendHolds';
import { renderScreens } from '@/test/render';
import { API_URL, server, startMockApi } from '@/test/server';
import { nearestStop } from '@/utils/nearest';

// The first render of a screen loads Expo Router and React Native's code: seconds on a busy laptop
jest.setTimeout(30_000);

// The phone's secure storage and its location: no phone under Jest, so stand-ins
jest.mock('expo-secure-store');
const secureStore = jest.mocked(SecureStore);

// The location answer the next "Continue" gets, and where the phone is
const mockLocation = { answer: 'granted' as 'granted' | 'denied' };
jest.mock('expo-location', () => {
  const { useState } = jest.requireActual<typeof import('react')>('react');
  const response = (status: string) => ({ status, granted: status === 'granted', canAskAgain: true, expires: 'never' });
  return {
    Accuracy: { Balanced: 3 },
    useForegroundPermissions: () => {
      const [answer, setAnswer] = useState(response('undetermined'));
      const ask = async () => {
        const next = response(mockLocation.answer);
        setAnswer(next);
        return next;
      };
      return [answer, ask, async () => answer];
    },
    // A parking lot on County Road 7, a short walk from Tamarack Middle School
    getCurrentPositionAsync: async () => ({ coords: { latitude: 46.8792, longitude: -91.4935, accuracy: 20 }, timestamp: 0 }),
  };
});

// expo-crypto's randomUUID needs the phone: a stand-in that counts (each call a new id)
let mockIds = 0;
jest.mock('expo-crypto', () => ({ randomUUID: () => `test-hold-${String(++mockIds).padStart(4, '0')}` }));

startMockApi();

// Each test starts from the client's own settings (one test turns retries off)
const defaults = queryClient.getDefaultOptions();

const june = { cardNumber: '21450021', pin: '4821' };
const signInJune = async () => setSession(await postSignIn(june));

const hold = (clientId: string, bookId = 'b04'): HoldToSend => ({
  clientId,
  bookId,
  bookTitle: bookId === 'b09' ? 'A History of Tamarack County' : 'The Quiet Orchard',
  stopId: 's03',
  stopName: 'Pine Hollow Elementary',
  note: '',
});

beforeEach(async () => {
  // The stand-in secure storage: none until a test says so, and every write works
  secureStore.isAvailableAsync.mockResolvedValue(false);
  secureStore.setItemAsync.mockResolvedValue();
  secureStore.deleteItemAsync.mockResolvedValue();
  setSession(null);
  queryClient.clear();
  queryClient.setDefaultOptions(defaults);
  await AsyncStorage.clear();
  useHoldQueue.setState({ holds: [], sending: false });
  await act(() => changeMyStop(null));
});

// ---------------------------------------------------------------- R1 routing and tabs
test('R1a: four tabs, Stops first', async () => {
  await renderScreens({
    '(tabs)/_layout': TabLayout,
    '(tabs)/index': () => <AppText>Stops screen</AppText>,
    '(tabs)/books': () => <AppText>Books screen</AppText>,
    '(tabs)/holds': () => <AppText>Holds screen</AppText>,
    '(tabs)/account': () => <AppText>Account screen</AppText>,
  });
  expect(screen.getByText('Stops screen')).toBeOnTheScreen();
  // Tests run as an iPhone: each tab is a button whose name ends "tab, N of 4"
  for (const [n, name] of ['Stops', 'Books', 'Holds', 'Account'].entries()) {
    expect(screen.getByRole('button', { name: `${name}, tab, ${n + 1} of 4` })).toBeOnTheScreen();
  }
});

test('R1a: the Holds tab says how many holds wait on this phone', async () => {
  await signInJune();
  await renderScreens({
    '(tabs)/_layout': TabLayout,
    '(tabs)/index': () => <AppText>Stops screen</AppText>,
    '(tabs)/books': () => <AppText>Books screen</AppText>,
    '(tabs)/holds': () => <AppText>Holds screen</AppText>,
    '(tabs)/account': () => <AppText>Account screen</AppText>,
  });
  await act(() => useHoldQueue.getState().add('p01', hold('phone-hold-0001')));
  expect(screen.getByRole('button', { name: 'Holds, 1 not sent yet' })).toBeOnTheScreen();
});

test('R1b: a stop opened by its address shows its name, its day and time, and where', async () => {
  await renderScreens({ 'stops/[id]': StopScreen }, '/stops/s02');
  expect(await screen.findByRole('header', { name: 'Ridgeline Senior Center' })).toBeOnTheScreen();
  expect(screen.getByText('When: Mondays, 2:00 PM to 3:30 PM')).toBeOnTheScreen();
  expect(screen.getByText('Where: 410 Ridgeline Drive, Cedar Bend')).toBeOnTheScreen();
});

test('R1b: an unknown stop says so and leads back to the list', async () => {
  await renderScreens({ 'stops/[id]': StopScreen, index: () => <AppText>The list</AppText> }, '/stops/s99');
  expect(await screen.findByText('No stop with that id. Check the link.')).toBeOnTheScreen();
  await userEvent.press(screen.getByRole('link', { name: 'See all stops' }));
  expect(await screen.findByText('The list')).toBeOnTheScreen();
});

// ---------------------------------------------------------------- R2 sign-in and the protected tab
test('R2a: a saved session comes back when the app starts, and changes are saved', async () => {
  secureStore.isAvailableAsync.mockResolvedValue(true);
  const saved = await postSignIn(june);
  secureStore.getItemAsync.mockResolvedValue(JSON.stringify(saved));
  await loadSession();
  expect(secureStore.getItemAsync).toHaveBeenCalledWith(sessionKey);
  await signInJune();
  expect(secureStore.setItemAsync).toHaveBeenLastCalledWith('bookmobile-session', expect.stringContaining('June Okafor'));
  setSession(null);
  expect(secureStore.deleteItemAsync).toHaveBeenCalledWith('bookmobile-session');
});

test('R2a: a saved session that is not a session is ignored', async () => {
  secureStore.isAvailableAsync.mockResolvedValue(true);
  secureStore.getItemAsync.mockResolvedValue('{"token": 42}');
  await loadSession();
  await renderScreens({ '(tabs)/holds': HoldsScreen }, '/holds');
  expect(screen.getByText('Sign in to see and place holds.')).toBeOnTheScreen();
});

test('R2b: a guest is asked to sign in on the Holds tab', async () => {
  await renderScreens({ '(tabs)/holds': HoldsScreen, 'sign-in': () => <AppText>Sign-in screen</AppText> }, '/holds');
  await userEvent.press(screen.getByRole('link', { name: 'Sign in' }));
  expect(await screen.findByText('Sign-in screen')).toBeOnTheScreen();
});

test("R2b: a signed-in patron sees the library's holds", async () => {
  await signInJune();
  await renderScreens({ '(tabs)/holds': HoldsScreen }, '/holds');
  expect(await screen.findByText('A History of Tamarack County')).toBeOnTheScreen();
  expect(screen.getByText('Pick up at Ridgeline Senior Center')).toBeOnTheScreen();
  expect(screen.getByText('Ready at the stop')).toBeOnTheScreen();
});

// ---------------------------------------------------------------- R3 data from the API
test('R3a: the guards accept what the API sends and refuse anything else', async () => {
  const stop = await (await fetch(`${API_URL}/api/stops/s01`)).json();
  const [book] = await (await fetch(`${API_URL}/api/books?q=orchard`)).json();
  expect(isStop(stop)).toBe(true);
  expect(isStop({ ...stop, latitude: '46.8' })).toBe(false);
  expect(isStop({ ...stop, day: 'sunday' })).toBe(false);
  expect(isBook(book)).toBe(true);
  expect(isBook({ ...book, onVan: 'yes' })).toBe(false);
  const ready = { id: 'h01', clientId: 'seed-hold-0001', bookId: 'b09', bookTitle: 'A History of Tamarack County', stopId: 's02', stopName: 'Ridgeline Senior Center', note: '', status: 'ready' };
  expect(isHold(ready)).toBe(true);
  expect(isHold({ ...ready, status: 'lost' })).toBe(false);
  expect(isHold(null)).toBe(false);
});

test('R3b: the Stops tab loads, then lists the eight stops with My stop marked', async () => {
  await act(() => changeMyStop('s03'));
  await renderScreens({ '(tabs)/index': StopsScreen });
  expect(screen.getByText('Loading stops…')).toBeOnTheScreen();
  expect(await screen.findByText('8 stops this week')).toBeOnTheScreen();
  expect(screen.getByRole('header', { name: 'Millrace Green Story Corner' })).toBeOnTheScreen();
  expect(screen.getAllByText('My stop')).toHaveLength(1);
  expect(screen.getByRole('link', { name: 'Open Pine Hollow Elementary' })).toBeOnTheScreen();
});

test('R3b: a failed load says what happened, and Try again works', async () => {
  server.use(http.get(`${API_URL}/api/stops`, () => HttpResponse.json({ error: 'server_error', message: 'Down' }, { status: 503 })));
  queryClient.setDefaultOptions({ queries: { ...defaults.queries, retry: false } });
  await renderScreens({ '(tabs)/index': StopsScreen });
  expect(await screen.findByText('The server had a problem (503). Try again in a moment.')).toBeOnTheScreen();
  server.resetHandlers(); // the server is back
  await userEvent.press(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByText('8 stops this week')).toBeOnTheScreen();
});

test('R3b: no stops this week is a message, not a blank screen', async () => {
  server.use(http.get(`${API_URL}/api/stops`, () => HttpResponse.json([])));
  await renderScreens({ '(tabs)/index': StopsScreen });
  expect(await screen.findByText('No stops are scheduled this week.')).toBeOnTheScreen();
});

test('R3: the Books tab (given) searches by title or author', async () => {
  await renderScreens({ '(tabs)/books': BooksScreen }, '/books');
  expect(await screen.findByText('12 books')).toBeOnTheScreen();
  await userEvent.type(screen.getByLabelText('Search books'), 'fox');
  expect(await screen.findByText('1 book')).toBeOnTheScreen();
  expect(screen.getByRole('header', { name: 'Moss and the Midnight Fox' })).toBeOnTheScreen();
});

// ---------------------------------------------------------------- R4 offline-safe storage
test('R4a: the queue saves itself on the phone, and one clientId is one hold', async () => {
  useHoldQueue.getState().add('p01', hold('phone-hold-0001'));
  useHoldQueue.getState().add('p01', hold('phone-hold-0001'));
  expect(useHoldQueue.getState().holds).toHaveLength(1);
  await waitFor(async () => {
    const saved = JSON.parse((await AsyncStorage.getItem('bookmobile-hold-queue')) ?? 'null');
    expect(saved.state.holds[0]).toMatchObject({ clientId: 'phone-hold-0001', patronId: 'p01', status: 'waiting', attempts: 0 });
  });
});

test('R4a: a saved queue is checked before the app trusts it', async () => {
  const good = { ...hold('phone-hold-0002'), patronId: 'p01', status: 'waiting', attempts: 1, problem: null };
  await AsyncStorage.setItem('bookmobile-hold-queue', JSON.stringify({ state: { holds: [good, { clientId: 7 }] }, version: 0 }));
  await loadHoldQueue();
  expect(useHoldQueue.getState().holds.map((h) => h.clientId)).toEqual(['phone-hold-0002']);
});

test('R4b: sending twice still makes one hold on the server', async () => {
  await signInJune();
  useHoldQueue.getState().add('p01', hold('phone-hold-0003'));
  await sendWaitingHolds('p01');
  expect(useHoldQueue.getState().holds).toHaveLength(0);
  // The answer was lost, so the phone sends the same hold again: the API answers 200, not a second hold
  useHoldQueue.getState().add('p01', hold('phone-hold-0003'));
  await sendWaitingHolds('p01');
  expect(useHoldQueue.getState().holds).toHaveLength(0);
  const onServer = await (await fetch(`${API_URL}/api/holds`, { headers: { Authorization: `Bearer ${(await postSignIn(june)).token}` } })).json();
  expect(onServer.map((h: { bookId: string }) => h.bookId)).toEqual(['b09', 'b04']);
});

test("R4b: a refusal is kept with the server's words; no answer keeps the hold waiting", async () => {
  await signInJune();
  useHoldQueue.getState().add('p01', hold('phone-hold-0004', 'b09'));
  await sendWaitingHolds('p01');
  expect(useHoldQueue.getState().holds[0]).toMatchObject({ status: 'refused', problem: 'You already have a hold on this book.' });
  server.use(http.post(`${API_URL}/api/holds`, () => HttpResponse.error()));
  useHoldQueue.getState().add('p01', hold('phone-hold-0005'));
  await sendWaitingHolds('p01');
  expect(useHoldQueue.getState().holds[1]).toMatchObject({ clientId: 'phone-hold-0005', status: 'waiting', attempts: 1 });
});

test("R4b: only the owner's sign-in sends a hold", async () => {
  await signInJune();
  useHoldQueue.getState().add('p02', hold('phone-hold-0006'));
  await sendWaitingHolds('p02');
  expect(useHoldQueue.getState().holds[0]).toMatchObject({ status: 'waiting', attempts: 0 });
});

test('R4c: My stop is read back when the app starts, checked, and saved when it changes', async () => {
  await AsyncStorage.setItem(settingsKey, JSON.stringify({ myStopId: 's05' }));
  await act(() => loadMyStop());
  expect(readMyStop()).toBe('s05');
  await AsyncStorage.setItem(settingsKey, '{not json');
  await act(() => loadMyStop());
  expect(readMyStop()).toBeNull();
  await act(() => changeMyStop('s03'));
  expect(JSON.parse((await AsyncStorage.getItem(settingsKey)) ?? 'null')).toEqual({ myStopId: 's03' });
});

// ---------------------------------------------------------------- R5 the form and the device feature
test('R5a: the hold schema says what to fix', () => {
  const noStop = holdSchema.safeParse({ stopId: '', note: '' });
  expect(noStop.error?.issues.map((issue) => issue.message)).toEqual(['Choose the stop where you will pick it up.']);
  const longNote = holdSchema.safeParse({ stopId: 's01', note: 'x'.repeat(121) });
  expect(longNote.error?.issues.map((issue) => issue.message)).toEqual(['Keep the note to 120 characters or fewer.']);
  expect(holdSchema.parse({ stopId: 's01', note: '  Large print  ' })).toEqual({ stopId: 's01', note: 'Large print' });
});

test('R5b: placing a hold saves it on the phone first, then sends it', async () => {
  await signInJune();
  await renderScreens({ _layout: () => <Stack />, 'hold/[bookId]': PlaceHoldScreen }, '/hold/b04');
  expect(await screen.findByRole('header', { name: 'The Quiet Orchard' })).toBeOnTheScreen();
  await userEvent.press(screen.getByRole('button', { name: 'Place hold' }));
  expect(await screen.findByText('Choose the stop where you will pick it up.')).toBeOnTheScreen();
  await userEvent.press(screen.getByRole('radio', { name: 'Pine Hollow Elementary' }));
  await userEvent.press(screen.getByRole('button', { name: 'Place hold' }));
  expect(await screen.findByText('Your hold on The Quiet Orchard is saved on this phone. It is sent as soon as you are online.')).toBeOnTheScreen();
  await waitFor(() => expect(useHoldQueue.getState().holds).toHaveLength(0)); // sent
});

test('R5b: My stop is chosen already, and a guest is asked to sign in', async () => {
  await act(() => changeMyStop('s06'));
  await renderScreens({ _layout: () => <Stack />, 'hold/[bookId]': PlaceHoldScreen }, '/hold/b04');
  expect(screen.getByText('Sign in to place a hold.')).toBeOnTheScreen();
  await act(signInJune);
  expect(await screen.findByRole('radio', { name: 'Cedar Bend Community Hall', checked: true })).toBeOnTheScreen();
});

test('R5c: the nearest stop and how far it is', async () => {
  const stops = await (await fetch(`${API_URL}/api/stops`)).json();
  const near = nearestStop(stops, { latitude: 46.7600, longitude: -91.4460 });
  expect(near?.stop.name).toBe('Millrace Farmers Market');
  expect(near?.km).toBeLessThan(0.2);
  expect(nearestStop([], { latitude: 0, longitude: 0 })).toBeNull();
});

test('R5d: Find my nearest stop explains first, asks, then answers', async () => {
  mockLocation.answer = 'granted';
  const stops = await (await fetch(`${API_URL}/api/stops`)).json();
  await renderScreens({ index: () => <NearestStop stops={stops} /> });
  await userEvent.press(screen.getByRole('button', { name: 'Find my nearest stop' }));
  expect(screen.getByText(/uses your location once, on this phone/)).toBeOnTheScreen();
  await userEvent.press(screen.getByRole('button', { name: 'Continue' }));
  expect(await screen.findByText('Your nearest stop is Tamarack Middle School, about 400 m away.')).toBeOnTheScreen();
  await userEvent.press(screen.getByRole('button', { name: 'Make this my stop' }));
  expect(readMyStop()).toBe('s05');
});

test('R5d: a "no" is an answer: the rest of the app still works', async () => {
  mockLocation.answer = 'denied';
  const stops = await (await fetch(`${API_URL}/api/stops`)).json();
  await renderScreens({ index: () => <NearestStop stops={stops} /> });
  await userEvent.press(screen.getByRole('button', { name: 'Find my nearest stop' }));
  await userEvent.press(screen.getByRole('button', { name: 'Continue' }));
  expect(await screen.findByText(/does not have your location, and that is fine/)).toBeOnTheScreen();
  await userEvent.press(screen.getByRole('button', { name: 'Not now' }));
  expect(screen.getByRole('button', { name: 'Find my nearest stop' })).toBeOnTheScreen();
});
