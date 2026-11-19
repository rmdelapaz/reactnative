// Tests (do not edit): npm test. renderRouter (expo-router/testing-library) builds a real Expo Router app
// from these files and opens it at initialUrl: exactly what happens when a volunteer taps a link to it.
import { act, screen, userEvent } from '@testing-library/react-native';
import { router, Tabs } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Text } from 'react-native';

import e08 from '../fixtures/event-e08.json';
import { CleanupScreen } from './CleanupScreen';
import { RootStack, unstable_settings } from './RootStack';

// MSW answers instead of shoreline-api, and keeps a list of every sign-up it receives
const signedUp: string[] = [];
const server = setupServer(
  http.get('http://api.test/api/events/:id', () => HttpResponse.json(e08)),
  http.post('http://api.test/api/events/:id/signups', ({ params }) => {
    signedUp.push(String(params.id));
    return HttpResponse.json({ status: 'waitlisted' }, { status: 201 });
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

function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Cleanups' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const app = {
  _layout: { default: RootStack, unstable_settings },
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': () => <Text>Upcoming cleanups</Text>,
  '(tabs)/profile': () => <Text>Your profile</Text>,
  'cleanups/[id]': CleanupScreen,
};

beforeEach(() => {
  signedUp.length = 0;
});

test('Task 3: a link straight to a cleanup has the tabs underneath, and back leads to them', async () => {
  await renderRouter(app, { initialUrl: '/cleanups/e08' });
  expect(await screen.findByRole('header', { name: 'Weekend Cove Cleanup' })).toBeOnTheScreen();
  expect(router.canGoBack()).toBe(true);
  await act(() => router.back());
  expect(await screen.findByText('Upcoming cleanups')).toBeOnTheScreen();
  expect(screen).toHavePathname('/');
});

test('Task 3: a link only opens a screen: ?join=yes signs nobody up', async () => {
  const user = userEvent.setup();
  await renderRouter(app, { initialUrl: '/cleanups/e08?join=yes' });
  expect(await screen.findByRole('header', { name: 'Weekend Cove Cleanup' })).toBeOnTheScreen();
  expect(signedUp).toEqual([]);
  await user.press(screen.getByRole('button', { name: 'Sign up' }));
  expect(await screen.findByText("You're signed up")).toBeOnTheScreen();
  expect(signedUp).toEqual(['e08']);
});
