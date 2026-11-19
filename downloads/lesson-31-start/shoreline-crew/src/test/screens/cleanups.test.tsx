import { screen, userEvent } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { http, HttpResponse } from 'msw';

import { setSession } from '@/api/client';
import { queryClient } from '@/api/queries';
import CleanupsScreen from '@/app/(tabs)/index';
import { renderScreens } from '@/test/render';
import { API_URL, recordRequests, server, startMockApi } from '@/test/server';

startMockApi();
beforeEach(() => setSession(null)); // a guest: the list is the same for everyone
afterEach(() => queryClient.clear()); // nothing cached carries over to the next test

function showCleanups() {
  return renderScreens({ _layout: () => <Stack />, index: CleanupsScreen });
}

// The Open button on each card is a link named after its cleanup
function openLinks() {
  return screen.queryAllByRole('link', { name: /^Open / });
}

it('loads every upcoming cleanup, five at a time', async () => {
  const requests = recordRequests();
  await showCleanups();
  expect(screen.getByText('Loading cleanups…')).toBeOnTheScreen();
  expect(await screen.findByText('8 cleanups')).toBeOnTheScreen();
  expect(openLinks()).toHaveLength(8);
  // Short cards do not fill the window, so the list asked for the second page by itself
  expect(requests.filter((request) => request === 'GET /api/events')).toHaveLength(2);
});

it('narrows the cards with the search field and the switch', async () => {
  const user = userEvent.setup();
  await showCleanups();
  await screen.findByText('8 cleanups');

  await user.type(screen.getByLabelText('Search cleanups'), 'otter');
  expect(openLinks().map((link) => link.props.accessibilityLabel)).toEqual([
    'Open Tide Pool Morning Cleanup',
    'Open Creek Mouth Willows',
  ]);

  await user.clear(screen.getByLabelText('Search cleanups'));
  await user.press(screen.getByRole('switch', { name: 'Only cleanups with spots left' }));
  expect(screen.getByText('7 of 8 cleanups')).toBeOnTheScreen();
  expect(screen.queryByRole('link', { name: 'Open Weekend Cove Cleanup' })).toBeNull(); // full
});

it('says what went wrong when the list cannot load, and tries again', async () => {
  server.use(http.get(`${API_URL}/api/events`, () => new HttpResponse(null, { status: 503 })));
  const user = userEvent.setup();
  await showCleanups();
  // The app tries three times, 1 and 2 seconds apart, before it gives up: Jest's fake clock
  // runs those seconds at once, but they count against findBy's 1-second limit
  const tryAgain = await screen.findByRole('button', { name: 'Try again' }, { timeout: 5000 });
  expect(screen.getByRole('alert')).toHaveTextContent(
    'The server had a problem (503). Try again in a moment.',
  );

  server.resetHandlers(); // the server is back
  await user.press(tryAgain);
  expect(await screen.findByText('8 cleanups')).toBeOnTheScreen();
});
