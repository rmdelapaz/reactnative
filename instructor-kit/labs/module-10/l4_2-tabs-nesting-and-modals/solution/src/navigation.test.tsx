// Tests (do not edit): npm test. renderRouter (expo-router/testing-library) builds a real Expo Router app
// from the files in app/ and opens it at initialUrl, as if a volunteer opened that address.
import { act, screen, userEvent } from '@testing-library/react-native';
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

// The tab bar's buttons, as a screen reader announces them
function tabs() {
  return screen
    .getAllByRole('button')
    .map((button) => String(button.props.accessibilityLabel ?? ''))
    .filter((label) => label.includes(', tab, '));
}

test('Task 1: the bar has three tabs, in order', async () => {
  await renderRouter('./app', { initialUrl: '/' });
  expect(tabs()).toEqual(['Sites, tab, 1 of 3', 'Saved, tab, 2 of 3', 'Guide, tab, 3 of 3']);
});

test('Task 1: the Saved tab opens its screen at /saved', async () => {
  const user = userEvent.setup();
  await renderRouter('./app', { initialUrl: '/' });
  await user.press(screen.getByRole('button', { name: 'Saved, tab, 2 of 3' }));
  expect(screen).toHavePathname('/saved');
  expect(screen.getByText('No saved beaches yet. Saving a beach is coming soon.')).toBeOnTheScreen();
});

test('Task 2: no header titled "(tabs)" above the tabs, only the tab header', async () => {
  await renderRouter('./app', { initialUrl: '/guide' });
  expect(shownTitles()).toEqual([]); // no header bar of the root stack is showing
  expect(screen.getByRole('heading', { name: 'Guide' })).toBeOnTheScreen(); // the tab navigator's header
});

test('Task 2: a site opens on top of the tabs, and its back button says Back', async () => {
  const user = userEvent.setup();
  await renderRouter('./app', { initialUrl: '/' });
  await user.press(screen.getByLabelText('Open Sandpiper Flats'));
  expect(screen).toHavePathname('/sites/sandpiper-flats');
  expect(shownTitles()).toEqual(['Sandpiper Flats']);
  expect(headers().find((header) => header.title === 'Sandpiper Flats')?.backTitle).toBe('Back');
});

test('Task 3: opened from the Guide tab, Done goes back to the Guide tab', async () => {
  const user = userEvent.setup();
  await renderRouter('./app', { initialUrl: '/guide' });
  await user.press(screen.getByRole('link', { name: 'Tide safety' }));
  expect(screen).toHavePathname('/tide-safety');
  await user.press(screen.getByRole('button', { name: 'Done' }));
  expect(screen).toHavePathname('/guide');
});

test('Task 3: opened from its address, Done puts the Sites tab in its place', async () => {
  const user = userEvent.setup();
  await renderRouter('./app', { initialUrl: '/tide-safety' });
  await user.press(screen.getByRole('button', { name: 'Done' }));
  expect(screen).toHavePathname('/');
  await act(async () => {}); // let the tab navigator draw the Sites tab
  expect(screen.getByRole('header', { name: 'Beach sites' })).toBeOnTheScreen();
});
