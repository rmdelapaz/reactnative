// Tests (do not edit): npm test
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import past from '../fixtures/past.json';
import { type ConnectionState, connectOnlineManager } from './online';
import { PastCleanups } from './PastCleanups';
import { Providers } from './Providers';

// MSW answers like shoreline-api: the real past cleanups (fixtures/), sliced into pages, totals in headers
const asked: string[] = [];
const server = setupServer(
  http.get('http://api.test/api/events', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page'));
    const perPage = Number(url.searchParams.get('perPage'));
    asked.push(`page ${page}`);
    return HttpResponse.json(past.slice((page - 1) * perPage, page * perPage), {
      headers: { 'X-Total-Count': String(past.length), 'X-Total-Pages': String(Math.ceil(past.length / perPage)) },
    });
  }),
);
// MSW 3 calls the option onUnhandledFrame. A request no handler answers fails the test it came from.
const unhandled: string[] = [];
beforeAll(() =>
  server.listen({
    onUnhandledFrame({ frame, defaults }) {
      const { data } = frame; // unknown: narrow it before reading the request
      const request =
        typeof data === 'object' && data !== null && 'request' in data && data.request instanceof Request
          ? data.request
          : undefined;
      unhandled.push(request ? `${request.method} ${request.url}` : frame.protocol);
      defaults.error();
    },
  }),
);
afterEach(() => {
  const missed = unhandled.splice(0);
  if (missed.length) throw new Error(`No MSW handler for: ${missed.join(', ')}`);
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// A fresh cache per test, as the course's tests make one: no retries, nothing thrown away mid-test
let client: QueryClient;
beforeEach(() => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  asked.length = 0;
});
afterEach(() => {
  client.clear();
  onlineManager.setOnline(true);
});

async function showList() {
  await render(
    <Providers client={client}>
      <PastCleanups base="http://api.test" />
    </Providers>,
  );
}

// A NetInfo-shaped source the test controls: report() plays the phone losing and finding its signal
function fakeNetInfo() {
  const source = { report: (state: ConnectionState): void => undefined };
  connectOnlineManager((listener) => {
    source.report = listener;
    return () => undefined;
  });
  return source;
}

test('Task 1: the list finds its cache and shows the first page', async () => {
  await showList();
  expect(await screen.findByRole('header', { name: 'Showing 3 of 7 past cleanups' })).toBeOnTheScreen();
  expect(screen.getByText(past[0].title)).toBeOnTheScreen();
});

test('Task 2: offline, the query waits (paused) and asks nothing; online again, it carries on', async () => {
  const netInfo = fakeNetInfo();
  await act(async () => netInfo.report({ isConnected: false }));
  expect(onlineManager.isOnline()).toBe(false);
  await showList();
  expect(await screen.findByText('Waiting for a connection…')).toBeOnTheScreen();
  expect(asked).toEqual([]);
  await act(async () => netInfo.report({ isConnected: true }));
  expect(await screen.findByRole('header', { name: 'Showing 3 of 7 past cleanups' })).toBeOnTheScreen();
  expect(asked).toEqual(['page 1']);
});

test('Task 2: null (the source does not know yet) counts as online', async () => {
  const netInfo = fakeNetInfo();
  await act(async () => netInfo.report({ isConnected: false }));
  expect(onlineManager.isOnline()).toBe(false);
  await act(async () => netInfo.report({ isConnected: null }));
  expect(onlineManager.isOnline()).toBe(true);
});

test('Task 3: Load more fetches the next page until there is none', async () => {
  const user = userEvent.setup();
  await showList();
  await user.press(await screen.findByRole('button', { name: 'Load more' }));
  expect(await screen.findByRole('header', { name: 'Showing 6 of 7 past cleanups' })).toBeOnTheScreen();
  await user.press(screen.getByRole('button', { name: 'Load more' }));
  expect(await screen.findByRole('header', { name: 'Showing 7 of 7 past cleanups' })).toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeOnTheScreen();
  expect(asked).toEqual(['page 1', 'page 2', 'page 3']);
});

test('Task 3: a refetch asks for every loaded page again, in order', async () => {
  const user = userEvent.setup();
  await showList();
  await user.press(await screen.findByRole('button', { name: 'Load more' }));
  expect(await screen.findByRole('header', { name: 'Showing 6 of 7 past cleanups' })).toBeOnTheScreen();
  asked.length = 0;
  await act(async () => client.refetchQueries({ queryKey: ['events', 'past'] }));
  expect(asked).toEqual(['page 1', 'page 2']);
});
