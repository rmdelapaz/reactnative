import { screen, userEvent } from '@testing-library/react-native';
import { Stack } from 'expo-router';

import { queryClient } from '@/api/queries';
import ItemScreen from '@/app/items/[id]';
import ItemsScreen from '@/app/index';
import NewItemScreen from '@/app/new-item';
import { renderScreens } from '@/test/render';
import { startMockApi } from '@/test/server';

startMockApi();
afterEach(() => queryClient.clear()); // nothing cached carries over to the next test

function showApp(initialUrl = '/') {
  return renderScreens(
    {
      _layout: () => <Stack />,
      index: ItemsScreen,
      'items/[id]': ItemScreen,
      'new-item': NewItemScreen,
    },
    initialUrl,
  );
}

it('lists the items as links that say their status', async () => {
  await showApp();
  expect(screen.getByText('Loading items…')).toBeOnTheScreen();
  expect(await screen.findByText('6 items')).toBeOnTheScreen();
  expect(screen.getByRole('link', { name: /^Check the first-aid kit\s*Done$/ })).toBeOnTheScreen();
});

it('adds an item with the form, and shows the server rule under the field', async () => {
  const user = userEvent.setup();
  await showApp('/new-item');

  // A name the list already has: the mock API says no, under the Name field
  await user.type(screen.getByLabelText('Name'), 'Order more gloves');
  await user.press(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByText('There is already an item called "Order more gloves".')).toBeOnTheScreen();

  await user.clear(screen.getByLabelText('Name'));
  await user.type(screen.getByLabelText('Name'), 'Buy tape');
  await user.press(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByRole('link', { name: /^Buy tape\s*Open$/ })).toBeOnTheScreen();
  expect(screen).toHavePathname('/');
});

it('marks an item as done', async () => {
  const user = userEvent.setup();
  await showApp('/items/i6');
  await user.press(await screen.findByRole('button', { name: 'Mark as done' }));
  expect(await screen.findByText('Status: Done')).toBeOnTheScreen();
});
