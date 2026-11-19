// Tests (do not edit): npm test
import { render, screen } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import notFound from '../fixtures/not-found.json';
import upcoming from '../fixtures/upcoming-page1.json';
import { apiBaseUrl } from './api/client';
import type { CleanupEvent } from './api/types';
import { NextUp } from './components/NextUp';
import { greeting, shareMessage, spotsText } from './shared/eventText';
import { formatDate } from './utils/format';

const API = 'http://api.test';
const events: CleanupEvent[] = upcoming.map((e) => ({ ...e, status: 'scheduled' as const }));

// MSW answers instead of shoreline-api, with the API's real first page (and its real headers: 8 in all)
const server = setupServer(
  http.get(`${API}/api/events`, () =>
    HttpResponse.json(upcoming, { headers: { 'X-Total-Count': '8', 'X-Total-Pages': '8' } }),
  ),
);
const unhandled: string[] = [];
beforeAll(() =>
  server.listen({
    onUnhandledFrame({ frame, defaults }) {
      const { data } = frame;
      const request =
        typeof data === 'object' && data !== null && 'request' in data && data.request instanceof Request
          ? data.request
          : undefined;
      unhandled.push(request ? `${request.method} ${request.url}` : frame.protocol);
      defaults.error();
    },
  }),
);
beforeEach(() => {
  process.env.EXPO_PUBLIC_API_URL = API;
});
afterEach(() => {
  jest.restoreAllMocks();
  server.resetHandlers();
  const missed = unhandled.splice(0);
  if (missed.length) throw new Error(`No MSW handler for: ${missed.join(', ')}`);
});
afterAll(() => server.close());

// What Expo's own fetch throws on a phone when nothing answers (node_modules/expo/src/winter/fetch/FetchErrors.ts):
// an Error whose message starts with "fetch failed:", NOT the browser's TypeError
class FetchError extends Error {
  constructor(message: string) {
    super(`fetch failed: ${message}`);
  }
}

test('Task 1: the spots line works as it was copied', () => {
  expect(spotsText(events[0])).toBe('5 spots left');
  expect(spotsText(events[1])).toBe('Full');
});

test('Task 1: the share message works on a phone (no page address)', () => {
  expect(shareMessage(events[1])).toBe(
    `Join me at Weekend Cove Cleanup on ${formatDate(events[1].date)}. Find it in the Shoreline Crew app.`,
  );
});

test('Task 1: the greeting works on a phone (no browser storage)', () => {
  expect(greeting()).toBe('Welcome, volunteer!');
  expect(greeting('Rosa')).toBe('Welcome back, Rosa!');
});

test('Task 2: the next cleanup, from the API', async () => {
  await render(<NextUp />);
  expect(await screen.findByRole('header', { name: 'Next up: Tide Pool Morning Cleanup' })).toBeOnTheScreen();
  expect(screen.getByText('8 upcoming cleanups in all')).toBeOnTheScreen();
});

test('Task 2: the API answers with an error status', async () => {
  server.use(http.get(`${API}/api/events`, () => HttpResponse.json(notFound, { status: 404 })));
  await render(<NextUp />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Nothing was found at this address. Check the link.');
});

test("Task 2: no answer on a phone (Expo's fetch rejects with a FetchError)", async () => {
  jest.spyOn(globalThis, 'fetch').mockRejectedValue(new FetchError('Could not connect to the server.'));
  await render(<NextUp />);
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Could not reach the server. Check that shoreline-api is running, then try again.',
  );
});

test('Task 3: the address comes from EXPO_PUBLIC_API_URL', () => {
  expect(apiBaseUrl()).toBe(API);
});

test('Task 3: a missing address says what to do', () => {
  delete process.env.EXPO_PUBLIC_API_URL;
  expect(() => apiBaseUrl()).toThrow('EXPO_PUBLIC_API_URL is not set: copy .env.example to .env.local');
});
