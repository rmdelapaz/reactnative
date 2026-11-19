// Tests (do not edit): npm test. renderRouter (expo-router/testing-library) builds a real Expo Router app
// from the files in app/ and opens it at initialUrl, as if a volunteer opened that address.
import { act, screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';

type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null };

// The header bars the stacks would draw right now, one per stack screen: its title, whether it is hidden,
// and the words of its back button (react-native-screens hands these to iOS and Android)
function headers() {
  const found: { title: unknown; hidden: unknown; backTitle: unknown }[] = [];
  const visit = (node: Node | Node[] | string | null) => {
    if (!node || typeof node === 'string') return;
    if (Array.isArray(node)) return node.forEach(visit);
    if (node.type === 'RNSScreenStackHeaderConfig') {
      found.push({ title: node.props.title, hidden: node.props.hidden, backTitle: node.props.backTitle });
    }
    (node.children ?? []).forEach(visit);
  };
  visit(screen.toJSON() as Node | Node[] | null);
  return found;
}

// The titles of the header bars that are not hidden
function shownTitles() {
  return headers()
    .filter((header) => !header.hidden)
    .map((header) => header.title);
}

test('Task 1: Open on a site goes to /sites/<id> and shows that site', async () => {
  const user = userEvent.setup();
  await renderRouter('./app', { initialUrl: '/' });
  await user.press(screen.getByLabelText('Open Driftwood Cove'));
  expect(screen).toHavePathname('/sites/driftwood-cove');
  expect(await screen.findByText('Parking: Street parking on Cove Lane; arrive early.')).toBeOnTheScreen();
});

test("Task 1: the header shows the site's name", async () => {
  await renderRouter('./app', { initialUrl: '/sites/north-jetty' });
  expect(await screen.findByText('Calder Bay')).toBeOnTheScreen();
  expect(shownTitles()).toEqual(['North Jetty']);
});

test('Task 1: back returns to the list underneath, as it was', async () => {
  const user = userEvent.setup();
  await renderRouter('./app', { initialUrl: '/' });
  await user.press(screen.getByLabelText('Open Long Strand Beach'));
  expect(router.canGoBack()).toBe(true);
  await act(() => router.back());
  expect(screen).toHavePathname('/');
  expect(screen.getByLabelText('Open Pelican Point Beach')).toBeOnTheScreen();
});

test('Task 2: an id that names no site says so', async () => {
  await renderRouter('./app', { initialUrl: '/sites/seal-rock' });
  expect(await screen.findByText('No beach site has the id seal-rock.')).toBeOnTheScreen();
});

test('Task 2: opened from its address, Back to the sites puts the list in its place', async () => {
  const user = userEvent.setup();
  await renderRouter('./app', { initialUrl: '/sites/seal-rock' });
  await user.press(await screen.findByRole('button', { name: 'Back to the sites' }));
  expect(screen).toHavePathname('/');
  expect(router.canGoBack()).toBe(false); // replaced: no dead end underneath
});

test('Task 2: opened from the list, Back to the sites goes back', async () => {
  const user = userEvent.setup();
  await renderRouter('./app', { initialUrl: '/' });
  await act(() => router.push({ pathname: '/sites/[id]', params: { id: 'seal-rock' } }));
  await user.press(await screen.findByRole('button', { name: 'Back to the sites' }));
  expect(screen).toHavePathname('/');
  expect(router.canGoBack()).toBe(false); // back: the list was underneath, and nothing is now
});

test('Task 3: a mistyped address gets the not-found screen, which replaces itself with the list', async () => {
  const user = userEvent.setup();
  await renderRouter('./app', { initialUrl: '/site/pelican-point' });
  expect(await screen.findByRole('header', { name: 'This page is not on the map' })).toBeOnTheScreen();
  expect(shownTitles()).toEqual(['Not found']);
  await user.press(screen.getByRole('link', { name: 'Back to the sites' }));
  expect(screen).toHavePathname('/');
  expect(router.canGoBack()).toBe(false);
});
