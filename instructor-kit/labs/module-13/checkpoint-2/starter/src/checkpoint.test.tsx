// Tests (do not edit): npm test. The first run takes up to a minute while Jest prepares Expo Router once.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onlineManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, configure, screen, render, userEvent } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { ReactNode } from 'react';

import { apiUrl } from './api';
import HomeScreen from './app/index';
import SiteRoute from './app/sites/[id]';
import { FavoriteList } from './FavoriteList';
import { favoritesKey } from './favorites';
import notFound from './fixtures/site-not-found.json';
import serverError from './fixtures/server-error.json';
import driftwoodCove from './fixtures/site-driftwood-cove.json';
import sites from './fixtures/sites.json';
import { SiteDetails } from './SiteDetails';

// MSW answers instead of shoreline-api, with its real answers: every site, Driftwood Cove, a 404 for the rest
const server = setupServer(
  http.get(`${apiUrl}/api/sites`, () => HttpResponse.json(sites)),
  http.get(`${apiUrl}/api/sites/:id`, ({ params }) =>
    params.id === 'driftwood-cove' ? HttpResponse.json(driftwoodCove) : HttpResponse.json(notFound, { status: 404 }),
  ),
);
// MSW 3 calls the option onUnhandledFrame. A request no handler answers fails the test it came from.
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
afterEach(() => {
  const missed = unhandled.splice(0);
  if (missed.length) throw new Error(`No MSW handler for: ${missed.join(', ')}`);
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeEach(() => AsyncStorage.clear());
afterEach(() => onlineManager.setOnline(true));

// A slow first render (Expo Router) gets time: up to 10 s for a findBy, 30 s for a test
configure({ asyncUtilTimeout: 10_000 });
jest.setTimeout(30_000);

// A fresh query cache for every test, no automatic retries (a failure shows at once)
function newClient() {
  // gcTime Infinity: no clean-up timers left running, so Jest can exit as soon as the tests are done
  return new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { gcTime: Infinity } } });
}
let client = newClient();
beforeEach(() => {
  client = newClient();
});
function WithQueries({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
function Layout() {
  return (
    <WithQueries>
      <Stack />
    </WithQueries>
  );
}
// The app's two routes, as files would give them: app/index.tsx and app/sites/[id].tsx. renderRouter switches
// Jest to fake timers, and a request started on the fake clock fails ("fetch failed"). So the cache is told it is
// offline while the router renders (its network queries pause), and online again once the real clock is back.
async function renderApp(initialUrl: string) {
  onlineManager.setOnline(false);
  const result = await renderRouter({ _layout: Layout, index: HomeScreen, 'sites/[id]': SiteRoute }, { initialUrl });
  jest.useRealTimers();
  await act(async () => onlineManager.setOnline(true));
  return result;
}
afterEach(() => jest.useRealTimers());

test('Task 1: a link to /sites/driftwood-cove opens that site', async () => {
  await renderApp('/sites/driftwood-cove');
  expect(await screen.findByRole('header', { name: 'Driftwood Cove' })).toBeOnTheScreen();
  expect(screen.getByText(driftwoodCove.description)).toBeOnTheScreen();
});

test('Task 1: pressing a site in the list opens its screen', async () => {
  await renderApp('/');
  await userEvent.setup().press(await screen.findByText('Driftwood Cove'));
  expect(screen).toHavePathname('/sites/driftwood-cove');
  expect(await screen.findByRole('header', { name: 'Driftwood Cove' })).toBeOnTheScreen();
});

test('Task 2: the site, after a moment of loading', async () => {
  await render(<SiteDetails id="driftwood-cove" />, { wrapper: WithQueries });
  expect(screen.getByText('Loading the site…')).toBeOnTheScreen();
  expect(await screen.findByRole('header', { name: 'Driftwood Cove' })).toBeOnTheScreen();
});

test("Task 2: an id the API does not have shows the API's sentence and Try again", async () => {
  await render(<SiteDetails id="seal-rock" />, { wrapper: WithQueries });
  expect(await screen.findByText('No site with that id.')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Try again' })).toBeOnTheScreen();
});

test('Task 2: Try again asks again', async () => {
  // The first answer is the API's simulated failure (?_status=500), the next one the site
  server.use(
    http.get(`${apiUrl}/api/sites/driftwood-cove`, () => HttpResponse.json(serverError, { status: 500 }), { once: true }),
  );
  await render(<SiteDetails id="driftwood-cove" />, { wrapper: WithQueries });
  await userEvent.setup().press(await screen.findByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('header', { name: 'Driftwood Cove' })).toBeOnTheScreen();
});

test('Task 3: favorites open with no connection', async () => {
  await AsyncStorage.setItem(favoritesKey, JSON.stringify([{ id: 'north-jetty', name: 'North Jetty' }]));
  onlineManager.setOnline(false);
  await render(<FavoriteList />, { wrapper: WithQueries });
  expect(await screen.findByText('★ North Jetty')).toBeOnTheScreen();
});

test('Task 3: a saved list this version cannot read means no favorites', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  await AsyncStorage.setItem(favoritesKey, '{not json');
  await render(<FavoriteList />, { wrapper: WithQueries });
  expect(await screen.findByText('No favorites yet.')).toBeOnTheScreen();
  expect(warn).toHaveBeenCalled();
  warn.mockRestore();
});
