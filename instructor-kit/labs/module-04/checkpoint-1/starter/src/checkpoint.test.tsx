// Tests (do not edit): npm test
import { render, screen, userEvent } from '@testing-library/react-native';

import sites from '../fixtures/sites.json';
import { BeachCard } from './BeachCard';
import { isSite } from './site';

import type { Site } from './types';

// the fixture's terrain is a plain string to TypeScript: the tests vouch for it (your app would use isSite)
const pelican = sites.find((s) => s.id === 'pelican-point') as unknown as Site;

test('A: the guard accepts every beach the API sent', () => {
  expect(sites.every((s) => isSite(s))).toBe(true);
});

test('A: the guard refuses what is not a beach', () => {
  expect(isSite(null)).toBe(false);
  expect(isSite('Pelican Point Beach')).toBe(false);
  expect(isSite({ ...sites[0], accessible: 'yes' })).toBe(false);
  expect(isSite({ ...sites[0], terrain: 'lava' })).toBe(false);
  const { parking: _parking, ...noParking } = sites[0];
  expect(isSite(noParking)).toBe(false);
});

test('B: the card shows the beach, every word in a Text, the name as its heading', async () => {
  await render(<BeachCard site={pelican} />);
  expect(screen.getByRole('header', { name: 'Pelican Point Beach' })).toBeOnTheScreen();
  expect(screen.getByText('Port Marisol')).toBeOnTheScreen();
  expect(screen.getByText('Parking')).toBeOnTheScreen();
});

test('B: a finger saves the beach, and the button changes its look', async () => {
  const user = userEvent.setup();
  await render(<BeachCard site={pelican} />);
  await user.press(screen.getByRole('button', { name: 'Save this beach' }));
  expect(screen.getByRole('button', { name: 'Saved' })).toHaveStyle({ backgroundColor: '#2d6a4f' });
});

test('C: the header row, the parking row and the badge are laid out for a phone', async () => {
  await render(<BeachCard site={pelican} />);
  expect(screen.getByTestId('beach-header')).toHaveStyle({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  });
  expect(screen.getByRole('header', { name: 'Pelican Point Beach' })).toHaveStyle({ flexShrink: 1 });
  expect(screen.getByText('Parking')).toHaveStyle({ width: 72 });
  expect(screen.getByTestId('parking-value')).toHaveStyle({ flex: 1 });
  expect(screen.getByTestId('access-badge')).toHaveStyle({ alignSelf: 'flex-start' });
});
